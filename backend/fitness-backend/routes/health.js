const express = require('express');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const HealthRecord = require('../models/HealthRecord');

const router = express.Router();

// @route   GET api/health
// @desc    Get all user's health records (with optional pagination/date filtering)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = { userId: req.user.id };
    
    // Add date filtering if provided
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.date = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    const { count, rows: healthRecords } = await HealthRecord.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['date', 'DESC']]
    });
    
    res.json({
      healthRecords,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/health/latest
// @desc    Get latest health record(s) for dashboard
// @access  Private
router.get('/latest', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1;
    const healthRecords = await HealthRecord.findAll({
      where: { userId: req.user.id },
      limit: limit > 10 ? 10 : limit, // Max limit 10
      order: [['date', 'DESC']]
    });
    
    if (healthRecords.length === 0) {
      return res.status(404).json({ message: 'No health records found' });
    }
    
    res.json(limit === 1 ? healthRecords[0] : healthRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/health/:id
// @desc    Get health record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json(healthRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/health
// @desc    Create a new health record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      weight, 
      bodyFatPercentage, 
      waistCircumference,
      chestCircumference,
      armCircumference,
      thighCircumference,
      shoulderCircumference,
      notes, 
      date
    } = req.body;

    // Check that at least one metric is provided
    const hasMetric = weight !== undefined || 
                      bodyFatPercentage !== undefined ||
                      waistCircumference !== undefined ||
                      chestCircumference !== undefined ||
                      armCircumference !== undefined ||
                      thighCircumference !== undefined ||
                      shoulderCircumference !== undefined;
    
    // If all metrics are undefined or null
    if (!hasMetric || [weight, bodyFatPercentage, waistCircumference, chestCircumference, armCircumference, thighCircumference, shoulderCircumference].every(v => v === null || v === undefined)) {
      return res.status(400).json({ message: 'At least one health metric must be provided' });
    }

    const healthRecord = await HealthRecord.create({
      weight,
      bodyFatPercentage,
      waistCircumference,
      chestCircumference,
      armCircumference,
      thighCircumference,
      shoulderCircumference,
      notes,
      date: date || new Date(),
      userId: req.user.id
    });

    res.status(201).json(healthRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/health/:id
// @desc    Update health record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      weight, 
      bodyFatPercentage, 
      waistCircumference,
      chestCircumference,
      armCircumference,
      thighCircumference,
      shoulderCircumference,
      notes, 
      date
    } = req.body;

    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    await healthRecord.update({
      weight: weight ?? healthRecord.weight,
      bodyFatPercentage: bodyFatPercentage ?? healthRecord.bodyFatPercentage,
      waistCircumference: waistCircumference ?? healthRecord.waistCircumference,
      chestCircumference: chestCircumference ?? healthRecord.chestCircumference,
      armCircumference: armCircumference ?? healthRecord.armCircumference,
      thighCircumference: thighCircumference ?? healthRecord.thighCircumference,
      shoulderCircumference: shoulderCircumference ?? healthRecord.shoulderCircumference,
      notes: notes ?? healthRecord.notes,
      date: date ?? healthRecord.date
    });
    
    res.json(healthRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/health/:id
// @desc    Delete health record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    await healthRecord.destroy();
    res.json({ message: 'Health record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router };
