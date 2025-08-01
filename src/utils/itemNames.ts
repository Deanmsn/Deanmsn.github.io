export const itemNameMap: Record<string, string> = {
  // 基础材料
  "wood": "木材",
  "stone": "石头",
  "coal": "煤炭",
  "iron": "铁矿石",
  "steel": "钢铁",
  "bamboo": "竹子",
  
  // 食物
  "fish": "鱼",
  "mushroom": "蘑菇",
  "berry": "浆果",
  "chickenEgg": "鸡蛋",
  "milk": "牛奶",
  "salmon": "三文鱼",
  "tuna": "金枪鱼",
  "honey": "蜂蜜",
  "mushroomStew": "蘑菇炖汤",
  "mysticalKoi": "神秘锦鲤",
  
  // 材料
  "herb": "草药",
  "wool": "羊毛",
  
  // 工具
  "axe": "斧头",
  
  // 技能书
  "baseAttackSkillBook": "基础攻击技能书",
  "boneShieldSkillBook": "骨盾技能书",
  "corrosiveBreathSkillBook": "腐蚀呼吸技能书",
  "summonBerryBirdSkillBook": "召唤浆果鸟技能书",
  "baseHealSkillBook": "基础治疗技能书",
  "poisonSkillBook": "毒药技能书",
  "selfHealSkillBook": "自愈技能书",
  "sweepSkillBook": "横扫技能书",
  "baseGroupHealSkillBook": "基础群体治疗技能书",
  "powerStrikeSkillBook": "强化冲击技能书",
  "guardianLaserSkillBook": "守护者激光技能书",
  "emperorCatFinale_forAstralEmpressBossSkillBook":'星辉终极裁决技能书',
  "prisonDominationSkillBook":'监狱统治技能书',
  "lavaBreathSkillBook": '熔岩之息技能书',
  "dragonRoarSkillBook":'龙吼技能书',
  "doubleStrikeSkillBook":'双重打击技能书',
  "forbiddenMagicSkillBook":'禁忌魔法技能书',
  "groupCurseSkillBook":'群体诅咒技能书',
  "ironWallSkillBook":'铁壁技能书',

  // 装备
  "woolCoat": "羊毛外套",
  "woolHat": "羊毛帽",
  "woolGloves": "羊毛手套",
  "woolPants": "羊毛裤",
  "ironPants": "铁裤",
  
  // 怪物材料
  "slimeGel": "史莱姆凝胶",
  "slimeCore": "史莱姆核心",
  "goblinEar": "哥布林耳朵",
  "goblinDagger": "哥布林匕首",
  "batWing": "蝙蝠翅膀",
  "batTooth": "蝙蝠牙齿",
  "wolfFang": "狼牙",
  "wolfPelt": "狼皮",
  "skeletonBone": "骷髅骨头",
  "skeletonShield": "骷髅盾牌",
  "toxicSpore": "毒孢子",
  "mushroomCap": "蘑菇帽",
  "lizardScale": "蜥蜴鳞片",
  "lizardTail": "蜥蜴尾巴",
  "spiritEssence": "灵魂精华",
  "ectoplasm": "灵质",
  "trollHide": "巨魔皮",
  "trollClub": "巨魔棒",
  "scorpionStinger": "蝎子毒刺",
  "scorpionCarapace": "蝎子甲壳",
  "guardianCore": "守护者核心",
  "ancientGear": "古代齿轮",
  "lavaHeart": "熔岩之心",
  "dragonScale": "龙鳞",
  
  // 高级装备
  "guardianCoreAmulet": "守护者核心护符",
  "dragonScaleArmor": "龙鳞护甲",

  //特殊物品
    "mysticalEssence": "神秘精华",
  "treasureMap":"藏宝图"
}

export function getItemDisplayName(itemId: string): string {
  return itemNameMap[itemId] || itemId
} 