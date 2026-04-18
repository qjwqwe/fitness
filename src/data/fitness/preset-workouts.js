// 预置训练数据
// 按分类组织

export default {
  初学者: [
    {
      name: "初学者全身入门",
      description: "适合健身新手的第一次训练，动作简单，强度适中",
      category: "初学者",
      difficulty: "简单",
      duration: 20,
      exercises: [
        { name: "原地开合跳", sets: 3, reps: "30秒" },
        { name: "墙俯卧撑", sets: 3, reps: "10-12" },
        { name: "深蹲", sets: 3, reps: "10-15" },
        { name: "平板支撑", sets: 3, reps: "20-30秒" },
        { name: "婴儿式拉伸", sets: 1, reps: "60秒" }
      ],
      notes: "动作不用快，注意保持正确姿势，感受肌肉发力"
    },
    {
      name: "新手十分钟唤醒",
      description: "短时间激活全身，适合工作日早晨",
      category: "初学者",
      difficulty: "简单",
      duration: 10,
      exercises: [
        { name: "原地踏步抬手", sets: 1, reps: "2分钟" },
        { name: "徒手深蹲", sets: 2, reps: "10" },
        { name: "跪姿俯卧撑", sets: 2, reps: "8" },
        { name: "侧平板支撑", sets: 2, reps: "15秒/侧" }
      ]
    }
  ],
  力量: [
    {
      name: "上肢推日",
      description: "专注胸部、肩部、三头肌力量训练",
      category: "力量",
      difficulty: "中等",
      duration: 40,
      exercises: [
        { name: "标准俯卧撑", sets: 4, reps: "8-12" },
        { name: "上斜俯卧撑", sets: 3, reps: "10-15" },
        { name: "靠墙俯卧撑（冲肩）", sets: 3, reps: "10" },
        { name: "三头肌撑", sets: 3, reps: "8-12" },
        { name: "肩环绕拉伸", sets: 2, reps: "10/方向" }
      ],
      notes: "如果俯卧撑太容易，可以尝试放慢节奏增加难度"
    },
    {
      name: "下肢日",
      description: "专注腿部和臀部训练",
      category: "力量",
      difficulty: "中等",
      duration: 35,
      exercises: [
        { name: "自重深蹲", sets: 4, reps: "12-15" },
        { name: "单腿罗马尼亚硬拉", sets: 3, reps: "8-10/腿" },
        { name: "箭步蹲", sets: 3, reps: "10/腿" },
        { name: "臀桥", sets: 3, reps: "15-20" },
        { name: "小腿提踵", sets: 4, reps: "20-25" }
      ]
    },
    {
      name: "背部拉力",
     description: "无器械背部训练，改善圆肩驼背",
      category: "力量",
      difficulty: "中等",
      duration: 30,
      exercises: [
        { name: "门框引体向上（水平）", sets: 4, reps: "8-12" },
        { name: "俯身划船（利用水瓶）", sets: 3, reps: "10-12/侧" },
        { name: "超人飞", sets: 3, reps: "12-15" },
        { name: "肩胛收缩", sets: 4, reps: "15" },
        { name: "胸部拉伸", sets: 2, reps: "30秒/侧" }
      ]
    }
  ],
  核心: [
    {
      name: "十分钟核心轰炸",
      description: "高效核心训练，练出平坦小腹",
      category: "核心",
      difficulty: "中等",
      duration: 10,
      exercises: [
        { name: "平板支撑", sets: 3, reps: "30-45秒" },
        { name: "卷腹", sets: 3, reps: "15-20" },
        { name: "俄罗斯转体", sets: 3, reps: "20次" },
        { name: "自行车卷腹", sets: 3, reps: "20次/侧" },
        { name: "登山跑", sets: 3, reps: "30秒" }
      ]
    },
    {
      name: "零基础核心",
      description: "适合新手的温和核心训练",
      category: "核心",
      difficulty: "简单",
      duration: 15,
      exercises: [
        { name: "死虫子", sets: 3, reps: "10次/侧" },
        { name: "鸟狗式", sets: 3, reps: "8次/侧" },
        { name: "平板支撑降阶", sets: 3, reps: "20秒" },
        { name: "腹式呼吸", sets: 3, reps: "10次" }
      ],
      notes: "重点在于感受核心发力，动作不用快"
    }
  ],
  cardio: [
    {
      name: "二十分钟HIIT",
      description: "高强度间歇训练，高效燃脂",
      category: "有氧",
      difficulty: "困难",
      duration: 20,
      exercises: [
        { name: "开合跳", sets: 4, reps: "40秒工作/20秒休息" },
        { name: "高抬腿", sets: 4, reps: "40秒工作/20秒休息" },
        { name: "波比跳", sets: 4, reps: "40秒工作/20秒休息" },
        { name: "登山跑", sets: 4, reps: "40秒工作/20秒休息" },
        { name: "原地跳", sets: 4, reps: "40秒工作/20秒休息" }
      ],
      notes: "根据自己体力调整，如果太累可以多休息"
    },
    {
      name: "低冲击有氧",
      description: "对膝盖友好的有氧训练",
      category: "有氧",
      difficulty: "简单",
      duration: 25,
      exercises: [
        { name: "原地踏步加抬手", sets: 1, reps: "3分钟" },
        { name: "侧步走加摆手", sets: 3, reps: "2分钟" },
        { name: "前后步开合", sets: 3, reps: "2分钟" },
        { name: "原地摆臂跑", sets: 4, reps: "1分钟工作/1分钟休息" },
        { name: "全身拉伸", sets: 1, reps: "5分钟" }
      ]
    }
  ],
  拉伸: [
    {
      name: "全身放松拉伸",
      description: "训练后全身拉伸，缓解肌肉酸痛",
      category: "拉伸",
      difficulty: "简单",
      duration: 10,
      exercises: [
        { name: "胸部拉伸", sets: 1, reps: "30秒/侧" },
        { name: "肩部拉伸", sets: 1, reps: "30秒/侧" },
        { name: "背部拉伸", sets: 1, reps: "30秒" },
        { name: "腘绳肌拉伸", sets: 1, reps: "30秒/侧" },
        { name: "股四头肌拉伸", sets: 1, reps: "30秒/侧" },
        { name: "小腿拉伸", sets: 1, reps: "30秒/侧" },
        { name: "髋屈肌拉伸", sets: 1, reps: "30秒/侧" }
      ]
    },
    {
      name: "晨间唤醒拉伸",
      description: "晨起五分钟，唤醒全身肌肉",
      category: "拉伸",
      difficulty: "简单",
      duration: 5,
      exercises: [
        { name: "猫牛式", sets: 1, reps: "10次" },
        { name: "婴儿式", sets: 1, reps: "60秒" },
        { name: "站立前屈", sets: 1, reps: "60秒" },
        { name: "胸大肌拉伸", sets: 1, reps: "30秒/侧" },
        { name: "手臂上举侧伸展", sets: 1, reps: "30秒/侧" }
      ]
    }
  ]
};
