const predefinedWorkouts = [
  // Beginner Full-Body Workout 1
  {
    id: 'beginner-fullbody-1',
    name: '初学者全身训练 1',
    description: '适合新手的低强度全身训练，无需器械，提升基础体能',
    type: 'full-body',
    duration: 15,
    difficulty: 'beginner',
    exercises: [
      { name: '原地踏步', sets: 1, reps: 60, duration: 60, notes: '保持节奏，抬起膝盖' },
      { name: '靠墙静蹲', sets: 3, reps: 10, duration: 30, notes: '背部贴墙，膝盖不超过脚尖' },
      { name: '跪姿俯卧撑', sets: 3, reps: 8, notes: '身体保持一条直线' },
      { name: '仰卧卷腹', sets: 3, reps: 12, notes: '下背部紧贴地面' },
      { name: '弓步拉伸', sets: 2, reps: 10, duration: 20, notes: '每侧各10次' },
      { name: '猫牛伸展', sets: 3, reps: 10, notes: '配合呼吸，缓慢移动' }
    ]
  },

  // Beginner Full-Body Workout 2
  {
    id: 'beginner-fullbody-2',
    name: '初学者全身训练 2',
    description: '进阶一点的新手全身训练，增强力量和协调性',
    type: 'full-body',
    duration: 20,
    difficulty: 'beginner',
    exercises: [
      { name: '开合跳', sets: 3, reps: 20, duration: 30, notes: '落地轻盈，膝盖微弯' },
      { name: '标准俯卧撑（跪姿可选）', sets: 3, reps: 10, notes: '胸部接近地面' },
      { name: '徒手深蹲', sets: 3, reps: 15, notes: '膝盖向外打开' },
      { name: '平板支撑', sets: 3, duration: 20, notes: '核心收紧，身体平直' },
      { name: '后踢腿', sets: 2, duration: 40, notes: '脚后跟踢臀部' },
      { name: '婴儿式拉伸', sets: 1, duration: 60, notes: '放松背部和臀部' }
    ]
  },

  // Cardio Workout 1
  {
    id: 'cardio-1',
    name: '低强度有氧操',
    description: '轻松有氧，提升心肺，适合热身或日常活动',
    type: 'cardio',
    duration: 15,
    difficulty: 'beginner',
    exercises: [
      { name: '原地快走', sets: 1, duration: 180, notes: '保持较快节奏' },
      { name: '侧向踏步', sets: 3, duration: 60, notes: '左右移动，手臂摆动' },
      { name: '高抬腿', sets: 3, reps: 20, duration: 30, notes: '膝盖抬高，保持呼吸' },
      { name: '后踢腿跑', sets: 3, duration: 40, notes: '放松上半身' },
      { name: '开合跳', sets: 3, reps: 30, duration: 40, notes: '中等强度，不要憋气' },
      { name: '原地放松踏步', sets: 1, duration: 120, notes: '缓慢呼吸，调整心率' }
    ]
  },

  // Cardio Workout 2
  {
    id: 'cardio-2',
    name: 'HIIT 有氧训练',
    description: '高强度间歇有氧，短时间高效燃脂',
    type: 'cardio',
    duration: 20,
    difficulty: 'intermediate',
    exercises: [
      { name: '热身开合跳', sets: 1, duration: 60, notes: '准备活动，激活身体' },
      { name: '波比跳（简化版）', sets: 8, reps: 8, duration: 45, notes: '休息15秒每组' },
      { name: '登山跑', sets: 4, duration: 40, notes: '核心收紧，快速抬腿' },
      { name: '箭步蹲跳', sets: 3, reps: 10, notes: '每侧各10次' },
      { name: '原地冲刺跑', sets: 4, duration: 30, notes: '尽全力，休息20秒' },
      { name: '拉伸放松', sets: 1, duration: 180, notes: '全身主要肌群拉伸' }
    ]
  },

  // Core Workout 1
  {
    id: 'core-1',
    name: '初学者核心训练',
    description: '温和核心训练，增强腹部力量，保护腰椎',
    type: 'core',
    duration: 10,
    difficulty: 'beginner',
    exercises: [
      { name: '腹式呼吸', sets: 1, duration: 60, notes: '激活深层核心肌群' },
      { name: '仰卧卷腹', sets: 3, reps: 12, notes: '不要用脖子借力' },
      { name: '死虫式', sets: 3, reps: 10, notes: '每侧各10次，下背部贴地' },
      { name: '平板支撑', sets: 3, duration: 20, notes: '核心收紧，不要塌腰' },
      { name: '侧平板支撑', sets: 2, duration: 15, notes: '每侧各15秒' },
      { name: '婴儿式拉伸', sets: 1, duration: 45, notes: '放松腰部' }
    ]
  },

  // Core Workout 2
  {
    id: 'core-2',
    name: '强化核心训练',
    description: '全面刺激腹部、腰部和臀部核心肌群',
    type: 'core',
    duration: 15,
    difficulty: 'intermediate',
    exercises: [
      { name: '卷腹转体', sets: 3, reps: 15, notes: '左右交替转体' },
      { name: '悬窗举腿（椅子辅助）', sets: 3, reps: 12, notes: '坐在椅子边缘，抬起双腿' },
      { name: '俄罗斯转体', sets: 3, reps: 20, notes: '身体保持稳定，转体到位' },
      { name: '平板支撑抬手', sets: 3, reps: 10, notes: '每侧交替抬起，保持平衡' },
      { name: '登山跑', sets: 3, duration: 45, notes: '快速交替，核心收紧' },
      { name: '桥臀', sets: 3, reps: 15, notes: '夹紧臀部，顶峰停留一秒' },
      { name: '猫牛伸展', sets: 1, reps: 10, notes: '放松脊柱' }
    ]
  },

  // Flexibility Routine
  {
    id: 'flexibility-1',
    name: '全身放松拉伸',
    description: '适合训练后放松或睡前拉伸，增加柔韧性，缓解疲劳',
    type: 'flexibility',
    duration: 12,
    difficulty: 'beginner',
    exercises: [
      { name: '颈部环绕', sets: 2, reps: 10, notes: '缓慢顺时针、逆时针转动' },
      { name: '肩部拉伸', sets: 2, duration: 30, notes: '每侧各30秒' },
      { name: '胸部拉伸', sets: 2, duration: 30, notes: '双手背后，打开胸腔' },
      { name: '体侧伸展', sets: 2, duration: 30, notes: '每侧各30秒' },
      { name: '腘绳肌拉伸', sets: 2, duration: 40, notes: '坐立，单腿伸直，身体前倾' },
      { name: '股四头肌拉伸', sets: 2, duration: 30, notes: '站立，拉住脚踝贴近臀部' },
      { name: '髋屈肌拉伸', sets: 2, duration: 35, notes: '弓步，身体向前推' },
      { name: '坐姿脊柱扭转', sets: 2, duration: 30, notes: '每侧各30秒' },
      { name: '小腿拉伸', sets: 2, duration: 30, notes: '每侧各30秒' },
      { name: '仰卧腿部放松', sets: 1, duration: 60, notes: '深呼吸，完全放松' }
    ]
  }
];

export default predefinedWorkouts;
