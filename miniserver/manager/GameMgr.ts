import itemMgr from "./ItemMgr";
import mapMgr from "./MapMgr";
import monsterMgr from "./MonsterMgr";
import skillMgr from "./SkillMgr";
import equipMgr from "./EquipMgr";
import { mysqldb } from "../util/mysqldb";
import { getRes } from "../common/gFunc";
import { redisdb } from "../util/redisdb";
import attributeMgr from "./AttributeMgr";
import expMgr from "./ExpMgr";

class GameMgr {
    config: any = null;

    private eventList: (() => void)[] = [];

    async init() {
        // 初始化 属性系统 需要最早初始化
        await attributeMgr.init();
        // 经验
        await expMgr.init();
        // 地图管理器初始化
        await mapMgr.init();
        // 物品管理器初始化
        await itemMgr.init();
        // 怪物管理器
        await monsterMgr.init();
        // 技能管理器
        await skillMgr.init();
        // 装备管理器
        await equipMgr.init();

        let config = await getRes("../etc/config");
        if (config == null) {
            throw "Config Error";
        }
        this.config = config;
        if (config.dev) {
            // this.config.host = this.config.devhost;
        }

        redisdb.init(config.redis);
        mysqldb.init(config.dbconfig);

        for (let i = 0; i < this.eventList.length; i++) {
            const func = this.eventList[i];
            func();
        }
    }

    regGameStart(func: ()=>void){
        this.eventList.push(func);
    }
}
let gameMgr = new GameMgr();
export default gameMgr;