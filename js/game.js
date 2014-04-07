
window.onload = function() {
	var oStart = document.getElementById("start")
	oStart.onclick = function() {//启动游戏
		this.style.display = "none"
		Game.init("panel")
	}
}
//关卡信息
var Game = {
	panel : null,
	oScoreNum : null,
	bees : null,
	plane : null,
	levels : [{
		eMap : ['e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e2', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1'],
		columns : 10,
		iSpeedX : 20,
		iSpeedY : 20,
		times : 4000//每隔多长时间飞下来一个小蜜蜂
	}, {
		eMap : ['e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e3', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1', 'e1'],
		columns : 10,
		iSpeedX : 30,
		iSpeedY : 30,
		times : 2000
	}],
	oEnemy : {//敌人的数据
		e1 : {
			type : 'enemy1',
			blood : 1,
			speed : 5,
			score : 1
		},
		e2 : {
			type : 'enemy2',
			blood : 2,
			speed : 7,
			score : 2
		},
		e3 : {
			type : 'enemy3',
			blood : 3,
			speed : 10,
			score : 3
		}
	},
	airPlane : {
		type : 'air1',
		bulletStyle : 'bullet'
	},
	init : function(id) {
		this.panel = document.getElementById(id)//游戏主面板
		this.createScore()//创建计分板
		this.createEnemy(0)//创建敌人
		this.createPlane()//创建飞机
	},
	createScore : function() {
		var oScore = document.createElement("div")
		oScore.id = "score"
		oScore.innerHTML = "积分:<span id='scoreNum'>0</span>"
		this.panel.appendChild(oScore)
		this.oScoreNum = document.getElementById("scoreNum")
	},
	createEnemy : function(iCurrentLevel) {
		debugger;
		document.title="第"+(iCurrentLevel+1)+"关"
		var oCurrentLevel = this.levels[iCurrentLevel]
		if (this.bees) {
			clearInterval(this.bees.timer)
			this.panel.removeChild(this.bees)
		}

		var oUl = document.createElement("ul")
		oUl.id = "bees"
		this.bees = oUl

		for (var i = 0; i < oCurrentLevel.eMap.length; i++) {//创建小蜜蜂
			var oLi = document.createElement("li")
			var enemy = this.oEnemy[oCurrentLevel.eMap[i]];
			oLi.className = enemy.type;
			oLi.blood = enemy.blood;
			oLi.speed = enemy.speed;
			oLi.score = enemy.score;

			oUl.appendChild(oLi)
		}

		this.panel.appendChild(oUl)
		oUl.style.width = oLi.offsetWidth * oCurrentLevel.columns + "px"
		oUl.style.left = (this.panel.offsetWidth - oUl.offsetWidth) / 2 + "px"
		this.aLi = oUl.getElementsByTagName("li")
		for (var i = 0; i < this.aLi.length; i++) {
			this.aLi[i].initLeft = this.aLi[i].offsetLeft;
			this.aLi[i].initTop = this.aLi[i].offsetTop;

		}
		for ( i = 0; i < this.aLi.length; i++) {
			this.aLi[i].style.left = this.aLi[i].initLeft + "px";
			this.aLi[i].style.top = this.aLi[i].initTop + "px";
			this.aLi[i].style.position = "absolute"

		}
		this.runEnemy(oCurrentLevel)

	},
	runEnemy : function(oCurrentLevel) {//敌人的左右移动
		var self = this;
		var bNeedHuanHang = true;
		this.bees.timer = setInterval(function() {
			var bees = self.bees;
			var L = 0;
			var R = self.panel.offsetWidth - self.bees.offsetWidth;
			if (bees.offsetLeft <= L || bees.offsetLeft >= R) {
				if (bNeedHuanHang) {
					bees.style.top = bees.offsetTop + oCurrentLevel.iSpeedY + "px"
					oCurrentLevel.iSpeedX *= -1;
					bNeedHuanHang = false;
				} else {

					bees.style.left = bees.offsetLeft + oCurrentLevel.iSpeedX + "px"
					bNeedHuanHang = true;
				}

			} else {
				bees.style.left = bees.offsetLeft + oCurrentLevel.iSpeedX + "px"
			}

		}, 1000)
		setInterval(function() {
			self.oneMove()
		}, oCurrentLevel.times)
	},
	createPlane : function() {
		var oPlane = document.createElement("div")
		oPlane.className = this.airPlane.type;
		this.plane = oPlane
		this.panel.appendChild(oPlane)
		oPlane.style.bottom = "0"
		oPlane.style.left = (this.panel.offsetWidth - oPlane.offsetWidth) / 2 + "px"
		this.bindPlaneEvent()

	},
	bindPlaneEvent : function() {//操作飞机
		var This = this;
		var timer = null;
		var flag = ""
		document.onkeydown = function(oEvent) {
			var ev = oEvent || window.event
			if (ev.keyCode == 37) {
				flag = "left"
			} else if (ev.keyCode == 39) {
				flag = "right"
			} else if (ev.keyCode == 38) {
				flag = "up"
			} else if (ev.keyCode == 40) {
				flag = "down"
			}
			if (!timer) {
				timer = setInterval(move, 30)
			}

		}
		document.onkeyup = function(oEvent) {
			var ev = oEvent || window.event
			clearInterval(timer)
			timer = null;
			flag = "";
			if (ev.keyCode == 32) {//空格键发射子弹
				This.createBullet();
			}
		}
		function move() {
			if (flag == "left") {
				This.plane.style.left = This.plane.offsetLeft - 10 + "px"
			} else if (flag == "right") {
				This.plane.style.left = This.plane.offsetLeft + 10 + "px"
			}
			//						else if (flag == "up") {
			//							This.plane.style.top = This.plane.offsetTop - 10 + "px"
			//						}else if (flag == "down") {
			//							This.plane.style.top = This.plane.offsetTop + 10 + "px"
			//						}
			if (This.plane.offsetLeft < 0) {
				This.plane.style.left = "0px";
			}
			if (This.plane.offsetLeft > This.panel.offsetWidth - This.plane.offsetWidth) {
				This.plane.style.left = This.panel.offsetWidth - This.plane.offsetWidth + "px";
			}
		}

	},
	createBullet : function() {//创建子弹
		var oBullet = document.createElement("div")
		oBullet.className = this.airPlane.bulletStyle
		this.panel.appendChild(oBullet)
		oBullet.style.left = this.plane.offsetLeft + this.plane.offsetWidth / 2 + "px"
		oBullet.style.top = this.plane.offsetTop - oBullet.offsetHeight + "px"
		this.runBullet(oBullet);
	},
	runBullet : function(oBullet) {//发射子弹
		var self = this;
		oBullet.timer = setInterval(function() {
			if (oBullet.offsetTop < 0) {
				clearInterval(oBullet.timer);
				self.panel.removeChild(oBullet)
				return;
			}
			oBullet.style.top = oBullet.offsetTop - 10 + "px"
			for (var i = 0; i < self.aLi.length; i++) {
				if (self.hasPengZhuang(oBullet, self.aLi[i])) {
					self.aLi[i].blood--;
					clearInterval(oBullet.timer)
					panel.removeChild(oBullet)
					if (self.aLi[i].blood == 0) {

						self.oScoreNum.innerHTML = parseInt(self.oScoreNum.innerHTML) + self.aLi[i].score;
						clearInterval(self.aLi[i].timer)
						self.bees.removeChild(self.aLi[i])
					}
					if (!self.aLi.length) {
						self.createEnemy(1);
						//进入下一关
					}
					break;
				}
			}

		}, 30)
	},
	oneMove : function() {//单兵作战
		var self = this;
		var oneBee = this.aLi[Math.floor(Math.random() * this.aLi.length)];
		oneBee.timer = setInterval(function() {
			//垂直高度差
			var b = (self.plane.offsetTop + self.plane.offsetHeight / 2) - (oneBee.parentNode.offsetTop + oneBee.offsetTop + oneBee.offsetHeight / 2)
			//水平高度差
			var a = (self.plane.offsetLeft + self.plane.offsetWidth / 2) - (oneBee.parentNode.offsetLeft + oneBee.offsetLeft + oneBee.offsetWidth / 2)
			var c = Math.sqrt(a * a + b * b)
			var iSY = b * oneBee.speed / c;
			var iSX = a * oneBee.speed / c;
			oneBee.style.left = oneBee.offsetLeft + iSX + "px"
			oneBee.style.top = oneBee.offsetTop + iSY + "px"
			if (self.hasPengZhuang(self.plane, oneBee)) {//游戏结束
				alert("game over!!!")
				window.location.reload();
			}
		}, 30)

	},
	hasPengZhuang : function(oBullet, oBee) {
		var L1 = oBullet.offsetLeft;
		var R1 = oBullet.offsetLeft + oBullet.offsetWidth;
		var T1 = oBullet.offsetTop;
		var B1 = oBullet.offsetTop + oBullet.offsetWidth;

		var oParent = oBee.parentNode;
		var L2 = oBee.offsetLeft + oParent.offsetLeft;
		var R2 = oBee.offsetLeft + oBee.offsetWidth + oParent.offsetLeft;
		var T2 = oBee.offsetTop + oParent.offsetTop;
		var B2 = oBee.offsetTop + oBee.offsetWidth + oParent.offsetTop;

		if (L1 > R2 || B1 < T2 || T1 > B2 || R1 < L2) {
			return false;
		} else {
			return true;
		}
	}
}
