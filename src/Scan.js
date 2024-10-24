
export default class Scan {
  constructor(option = {}) {
    this.scanInterval = option.scanInterval || 50 // 默认输入间隔小于设定时间，则判定为扫码枪输入
    this.onScan = option.onScan
    this.barCode = ''
    this.lastTime = 0
    this.init();
  }

  /**
   * 初始化程序
   */
  async init() {
    this.clearBarCode = () => {
      this.barCode = ''
      this.lastTime = 0
    }
    this.onKeyPress = (e) => {
      e = e || window.event;
      let currCode = e.keyCode || e.which || e.charCode;
      // 回车
      if (currCode == 13) {
        if (typeof this.onScan === 'function' && this.barCode) {
          this.onScan(this.barCode)
        }
        // 回车输入后清空
        this.clearBarCode();
        return
      }
      let currTime = new Date().getTime();
      if (this.lastTime > 0) {
        if (currTime - this.lastTime <= this.scanInterval) {// 扫码枪有效输入间隔毫秒
          this.barCode += String.fromCharCode(currCode);
        } else if (currTime - this.lastTime > this.scanInterval) {
          this.clearBarCode();
        }
      } else {
        // 第一次按键
        this.barCode = String.fromCharCode(currCode);
      }
      this.lastTime = currTime;
    }
    window.addEventListener('keypress', this.onKeyPress)
    return this
  }

  /**
   * 销毁事件及对象
   */
  destroy() {
    window.removeEventListener('keypress', this.onKeyPress)
    return this
  }
}
