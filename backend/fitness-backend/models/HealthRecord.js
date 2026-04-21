const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  weight: {
    type: DataTypes.FLOAT, // in kg
    allowNull: true,
    validate: {
      min: 0
    }
  },
  bodyFatPercentage: {
    type: DataTypes.FLOAT, // 0-100%
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  waistCircumference: {
    type: DataTypes.FLOAT, // in cm
    allowNull: true,
    validate: {
      min: 0
    }
  },
  chestCircumference: {
    type: DataTypes.FLOAT, // in cm
    allowNull: true,
    validate: {
      min: 0
    }
  },
  armCircumference: {
    type: DataTypes.FLOAT, // in cm
    allowNull: true,
    validate: {
      min: 0
    }
  },
  thighCircumference: {
    type: DataTypes.FLOAT, // in cm
    allowNull: true,
    validate: {
      min: 0
    }
  },
  shoulderCircumference: {
    type: DataTypes.FLOAT, // in cm
    allowNull: true,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  validate: {
    atLeastOneMetric() {
      const hasMetric = this.weight !== null || 
                        this.bodyFatPercentage !== null ||
                        this.waistCircumference !== null ||
                        this.chestCircumference !== null ||
                        this.armCircumference !== null ||
                        this.thighCircumference !== null ||
                        this.shoulderCircumference !== null;
      
      if (!hasMetric) {
        throw new Error('At least one health metric must be provided');
      }
    }
  }
});

// Set up association with User
User.hasMany(HealthRecord, { foreignKey: 'userId' });
HealthRecord.belongsTo(User, { foreignKey: 'userId' });

module.exports = HealthRecord;
