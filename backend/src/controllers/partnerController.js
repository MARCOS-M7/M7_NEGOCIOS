
import { Partner, User } from '../models/index.js';
import axios from 'axios';

export const listPartners = async (req, res) => {
  try {
    // Filtrar por tipo se fornecido
    const { type, active } = req.query;
    const where = {};
    
    if (type) {
      where.type = type;
    }
    
    if (active !== undefined) {
      where.active = active === 'true';
    }
    
    const partners = await Partner.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    res.json(partners);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'email', 'role'] }]
    });
    
    if (!partner) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }
    
    res.json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createPartner = async (req, res) => {
  try {
    const { name, document, type, parent_id } = req.body;
    
    // Verificar se o documento já existe
    if (document) {
      const existingPartner = await Partner.findOne({ where: { document } });
      if (existingPartner) {
        return res.status(400).json({ error: 'Documento já cadastrado' });
      }
    }
    
    // Criar parceiro
    const partner = await Partner.create({
      name,
      document,
      type,
      parent_id,
      active: true
    });
    
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, document, type, parent_id, active } = req.body;
    
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }
    
    // Verificar se o documento já existe em outro parceiro
    if (document && document !== partner.document) {
      const existingPartner = await Partner.findOne({ where: { document } });
      if (existingPartner && existingPartner.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Documento já cadastrado para outro parceiro' });
      }
    }
    
    // Atualizar parceiro
    await partner.update({
      name: name || partner.name,
      document: document || partner.document,
      type: type || partner.type,
      parent_id: parent_id || partner.parent_id,
      active: active !== undefined ? active : partner.active
    });
    
    res.json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchPartnerInfo = async (req, res) => {
  try {
    const { document } = req.query;
    
    if (!document || document.length < 8) {
      return res.status(400).json({ error: 'Documento inválido' });
    }
    
    // Remover caracteres especiais
    const cleanDocument = document.replace(/[^\d]/g, '');
    
    // Verificar se é CNPJ (14 dígitos)
    if (cleanDocument.length === 14) {
      // Buscar na API ReceitaWS
      const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cleanDocument}`, {
        headers: {
          'Authorization': `Bearer ${process.env.RECEITAWS_TOKEN}`
        }
      });
      
      if (response.data.status === 'ERROR') {
        return res.status(404).json({ error: 'CNPJ não encontrado' });
      }
      
      return res.json({
        name: response.data.nome,
        document: cleanDocument,
        type: 'Jurídica',
        extraData: {
          address: `${response.data.logradouro}, ${response.data.numero} - ${response.data.bairro}`,
          city: response.data.municipio,
          state: response.data.uf,
          zip: response.data.cep,
          activity: response.data.atividade_principal[0].text
        }
      });
    } else {
      // CPF - não temos API pública, retornar apenas o documento formatado
      return res.json({
        document: cleanDocument,
        type: 'Física'
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erro ao buscar informações' });
  }
};
