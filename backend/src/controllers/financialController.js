
import { Receivable, Payable, Partner } from '../models/index.js';
import { Op } from 'sequelize';
import PDFDocument from 'pdfkit';

export const getFinancialSummary = async (req, res) => {
  try {
    // Opcionalmente filtrar por parceiro
    const { partner_id } = req.query;
    const where = {};
    
    if (partner_id) {
      where.partner_id = partner_id;
    }
    
    // Calcular totais de recebíveis
    const receivablesTotals = await Receivable.findAll({
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('gross_amount')), 'total_amount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where,
      group: ['status']
    });
    
    // Calcular totais de pagamentos
    const payablesTotals = await Payable.findAll({
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where,
      group: ['status']
    });
    
    // Formatar resultados
    const receivables = {};
    receivablesTotals.forEach(item => {
      receivables[item.status] = {
        count: parseInt(item.getDataValue('count')),
        amount: parseFloat(item.getDataValue('total_amount'))
      };
    });
    
    const payables = {};
    payablesTotals.forEach(item => {
      payables[item.status] = {
        count: parseInt(item.getDataValue('count')),
        amount: parseFloat(item.getDataValue('total_amount'))
      };
    });
    
    res.json({
      receivables,
      payables
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listReceivables = async (req, res) => {
  try {
    const { partner_id, status, start_date, end_date } = req.query;
    const where = {};
    
    // Filtros
    if (partner_id) {
      where.partner_id = partner_id;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Filtro por período
    if (start_date || end_date) {
      where.due_date = {};
      
      if (start_date) {
        where.due_date[Op.gte] = new Date(start_date);
      }
      
      if (end_date) {
        where.due_date[Op.lte] = new Date(end_date);
      }
    }
    
    const receivables = await Receivable.findAll({
      where,
      include: [{ model: Partner, attributes: ['id', 'name'] }],
      order: [['due_date', 'ASC']]
    });
    
    res.json(receivables);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createReceivable = async (req, res) => {
  try {
    const { 
      partner_id, 
      invoice_number, 
      issue_date, 
      due_date, 
      gross_amount, 
      commission_rate
    } = req.body;
    
    // Calcular comissão e valor líquido
    const commission_amount = (gross_amount * commission_rate) / 100;
    const net_amount = gross_amount - commission_amount;
    
    const receivable = await Receivable.create({
      partner_id,
      invoice_number,
      issue_date,
      due_date,
      gross_amount,
      commission_rate,
      commission_amount,
      net_amount,
      status: 'Aberto'
    });
    
    res.status(201).json(receivable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReceivableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date_received } = req.body;
    
    const receivable = await Receivable.findByPk(id);
    if (!receivable) {
      return res.status(404).json({ error: 'Recebível não encontrado' });
    }
    
    // Atualizar status e data de recebimento se aplicável
    await receivable.update({
      status,
      date_received: status === 'Recebido' ? (date_received || new Date()) : receivable.date_received
    });
    
    res.json(receivable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listPayables = async (req, res) => {
  try {
    const { partner_id, status, start_date, end_date } = req.query;
    const where = {};
    
    // Filtros
    if (partner_id) {
      where.partner_id = partner_id;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Filtro por período
    if (start_date || end_date) {
      where.due_date = {};
      
      if (start_date) {
        where.due_date[Op.gte] = new Date(start_date);
      }
      
      if (end_date) {
        where.due_date[Op.lte] = new Date(end_date);
      }
    }
    
    const payables = await Payable.findAll({
      where,
      include: [{ model: Partner, attributes: ['id', 'name'] }],
      order: [['due_date', 'ASC']]
    });
    
    res.json(payables);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createPayable = async (req, res) => {
  try {
    const { 
      partner_id, 
      doc_number, 
      issue_date, 
      due_date, 
      amount 
    } = req.body;
    
    const payable = await Payable.create({
      partner_id,
      doc_number,
      issue_date,
      due_date,
      amount,
      status: 'Aberto'
    });
    
    res.status(201).json(payable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePayableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const payable = await Payable.findByPk(id);
    if (!payable) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    
    // Atualizar status
    await payable.update({ status });
    
    res.json(payable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const generateFinancialReport = async (req, res) => {
  try {
    const { type, start_date, end_date, partner_id } = req.query;
    
    // Configurar o PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);
    
    // Título do relatório
    doc.fontSize(16).text(`Relatório Financeiro - ${type === 'receivables' ? 'Recebíveis' : 'Pagamentos'}`, {
      align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${start_date || 'Início'} a ${end_date || 'Hoje'}`, {
      align: 'center'
    });
    doc.moveDown();
    
    // Buscar dados
    const where = {};
    if (partner_id) {
      where.partner_id = partner_id;
    }
    
    if (start_date || end_date) {
      where.due_date = {};
      if (start_date) where.due_date[Op.gte] = new Date(start_date);
      if (end_date) where.due_date[Op.lte] = new Date(end_date);
    }
    
    let data = [];
    let total = 0;
    
    if (type === 'receivables') {
      data = await Receivable.findAll({
        where,
        include: [{ model: Partner, attributes: ['name'] }],
        order: [['due_date', 'ASC']]
      });
      
      // Cabeçalho da tabela
      doc.fontSize(10).text('Data Venc.', 50, 150);
      doc.text('Parceiro', 130, 150);
      doc.text('Nº Fatura', 280, 150);
      doc.text('Valor', 380, 150);
      doc.text('Status', 450, 150);
      
      doc.moveTo(50, 170).lineTo(550, 170).stroke();
      
      let y = 190;
      data.forEach(item => {
        doc.fontSize(9).text(item.due_date.toLocaleDateString('pt-BR'), 50, y);
        doc.text(item.Partner?.name || '', 130, y, { width: 140 });
        doc.text(item.invoice_number || '', 280, y);
        doc.text(`R$ ${item.gross_amount.toFixed(2)}`, 380, y);
        doc.text(item.status, 450, y);
        
        total += parseFloat(item.gross_amount);
        y += 20;
        
        if (y > 700) {
          doc.addPage();
          y = 50;
          
          // Cabeçalho na nova página
          doc.fontSize(10).text('Data Venc.', 50, 30);
          doc.text('Parceiro', 130, 30);
          doc.text('Nº Fatura', 280, 30);
          doc.text('Valor', 380, 30);
          doc.text('Status', 450, 30);
          
          doc.moveTo(50, 50).lineTo(550, 50).stroke();
        }
      });
    } else {
      data = await Payable.findAll({
        where,
        include: [{ model: Partner, attributes: ['name'] }],
        order: [['due_date', 'ASC']]
      });
      
      // Cabeçalho da tabela
      doc.fontSize(10).text('Data Venc.', 50, 150);
      doc.text('Fornecedor', 130, 150);
      doc.text('Nº Documento', 280, 150);
      doc.text('Valor', 380, 150);
      doc.text('Status', 450, 150);
      
      doc.moveTo(50, 170).lineTo(550, 170).stroke();
      
      let y = 190;
      data.forEach(item => {
        doc.fontSize(9).text(item.due_date.toLocaleDateString('pt-BR'), 50, y);
        doc.text(item.Partner?.name || '', 130, y, { width: 140 });
        doc.text(item.doc_number || '', 280, y);
        doc.text(`R$ ${item.amount.toFixed(2)}`, 380, y);
        doc.text(item.status, 450, y);
        
        total += parseFloat(item.amount);
        y += 20;
        
        if (y > 700) {
          doc.addPage();
          y = 50;
          
          // Cabeçalho na nova página
          doc.fontSize(10).text('Data Venc.', 50, 30);
          doc.text('Fornecedor', 130, 30);
          doc.text('Nº Documento', 280, 30);
          doc.text('Valor', 380, 30);
          doc.text('Status', 450, 30);
          
          doc.moveTo(50, 50).lineTo(550, 50).stroke();
        }
      });
    }
    
    // Adicionar rodapé com total
    doc.moveTo(50, doc.y + 20).lineTo(550, doc.y + 20).stroke();
    doc.fontSize(11).text(`Total: R$ ${total.toFixed(2)}`, 380, doc.y + 30);
    
    // Adicionar data de geração
    doc.fontSize(8).text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 50, doc.y + 50);
    
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
