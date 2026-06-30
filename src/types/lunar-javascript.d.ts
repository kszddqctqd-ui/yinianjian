declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getLunar(): Lunar;
    getWeekInChinese(): string;
    getXingzuo(): string;
    getYear(): number;
  }

  export class Lunar {
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getTimeInGanZhi(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getEightChar(): EightChar;
    getPrevJie(includeCurrent?: boolean): any;
    getNextJie(includeCurrent?: boolean): any;
    getChong(): string;
    getChongDesc(): string;
    getDayYi(): string[];
    getDayJi(): string[];
    getDayXiongSha(): string;
    getYearZhi(): string;
  }

  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getYearShiShenGan(): string;
    getMonthShiShenGan(): string;
    getDayShiShenGan(): string;
    getTimeShiShenGan(): string;
    getYearHideGan(): string[];
    getMonthHideGan(): string[];
    getDayHideGan(): string[];
    getTimeHideGan(): string[];
    getDayXunKong(): string[];
    getYun(): Yun;
    toString(): string;
  }

  export class Yun {
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartHour(): number;
    isForward(): boolean;
    getDaYun(): DaYunItem[];
    getLunar(): Lunar;
    getStartSolar(): Solar;
    getGender(): number;
  }

  export class DaYunItem {
    getStartYear(): number;
    getGanZhi(): string;
  }
}
