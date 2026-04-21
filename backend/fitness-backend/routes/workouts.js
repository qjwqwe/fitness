const express = require('express');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const Workout = require('../models/Workout');

const router = express.Router();

// @route   GET api/workouts
// @desc    Get all user's workouts (with optional pagination/date filtering)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { page = 1, limit = 10, startDate, endDate, type } = req.query;
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
    
    // Add type filtering if provided
    if (type) {
      where.type = type;
    }
    
    const { count, rows: workouts } = await Workout.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['date', 'DESC']]
    });
    
    res.json({
      workouts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/workouts/:id
// @desc    Get workout by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      name, 
      type, 
      duration, 
      caloriesBurned, 
      sets, 
      reps, 
      weight, 
      notes, 
      date, 
      completed 
    } = req.body;

    const workout = await Workout.create({
      name,
      type,
      duration,
      caloriesBurned,
      sets,
      reps,
      weight,
      notes,
      date: date || new Date(),
      completed: completed !== undefined ? completed : true,
      userId: req.user.id
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/workouts/:id
// @desc    Update workout
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      name, 
      type, 
      duration, 
      caloriesBurned, 
      sets, 
      reps, 
      weight, 
      notes, 
      date, 
      completed 
    } = req.body;

    const workout = await Workout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await workout.update({
      name: name ?? workout.name,
      type: type ?? workout.type,
      duration: duration ?? workout.duration,
      caloriesBurned: caloriesBurned ?? workout.caloriesBurned,
      sets: sets ?? workout.sets,
      reps: reps ?? workout.reps,
      weight: weight ?? workout.weight,
      notes: notes ?? workout.notes,
      date: date ?? workout.date,
      completed: completed ?? workout.completed
    });
    
    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/workouts/:id
// @desc    Delete workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await workout.destroy();
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router };
