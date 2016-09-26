;(function($){
	var LightBox=function(){
		var self=this;

        //创建遮罩和弹出框
    	this.popupMask=$('<div id="lightbox-mask">');
    	this.popupWin = $('<div id="lightbox-popup">');
      //保存Body
      this.bodyNode = $(document.body);

      //渲染剩余的DOM，并且插入到BODY
      this.renderDOM();

      this.picViewArea = this.popupWin.find("div.lightbox-pic-view");//图片预览区域
      this.popupPic = this.popupWin.find("img.lightbox-img");//图片
      this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");//图片描述区域
      this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
      this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");
      
      this.captionText = this.popupWin.find("p.lightbox-pic-desc");//图片表述
      this.currentIndex = this.popupWin.find("span.lightbox-of-index");//图片索引
      this.closeBtn = this.popupWin.find("span.lightbox-btn-close");//图片关闭按钮


      //准备开发事件委托，获取组数据
      this.groupName = null;
      this.groupData = [];  //放置同一组数据
      this.bodyNode.delegate(".js-lightbox,[data-role=lightbox]","click",function(e){
      //阻止事件冒泡
      e.stopPropagation();
      var currentGroupName = $(this).attr("data-group");
      if(currentGroupName != self.groupName){
      	self.groupName = currentGroupName;
      	//根据当前组名获取同一组数据
      	self.getGroup();
      }
         //初始化弹出
         self.initPopup($(this))
        });
       //关闭弹出
      this.popupMask.click(function(){
       	$(this).fadeOut();
       	self.popupWin.fadeOut();
       });
      this.closeBtn.click(function(){
       	self.popupMask.fadeOut();
       	self.popupWin.fadeOut();
       });

       //上下切换按钮功能实现
      this.flag = true;//做一标识，防止双击时打乱了index
       //向上切换
      this.nextBtn.hover(function(){
      	 if(!$(this).hasClass("unabled")&&self.groupData.length>1){
      	 	$(this).addClass("lightbox-next-btn-show");
      	 };
      },function(){
      	if(!$(this).hasClass("unabled")&&self.groupData.length>1){
      	 	$(this).removeClass("lightbox-next-btn-show");
      	 };
      }).click(function(e){
      	if(!$(this).hasClass("unabled")&&self.flag){
      		self.flag= false;
      		e.stopPropagation();
      		self.goto("next");
      	};
      });
     // 向下切换 
      this.prevBtn.hover(function(){
      	 if(!$(this).hasClass("unabled")&&self.groupData.length>1){
      	 	$(this).addClass("lightbox-prev-btn-show");
      	 };
      },function(){
      	if(!$(this).hasClass("unabled")&&self.groupData.length>1){
      	 	$(this).removeClass("lightbox-prev-btn-show");
      	 };
      	}).click(function(e){
      	if(!$(this).hasClass("unabled")&&self.flag){
      		self.flag = false;
      		e.stopPropagation();
      		self.goto("prev");
      	};
      });
	};

	LightBox.prototype={
      goto:function(dir){
        if(dir ==="next"){
        //this.groupData
        //this.index
        this.index++;
        if(this.index>=this.groupData.length-1){
        this.nextBtn.addClass("unabled").removeClass("lightbox-next-btn-show");
        };
        if(this.index!=0){
        this.prevBtn.removeClass("unabled");
        };

        var src=this.groupData[this.index].src;
        this.loadPicSize(src);
        }else if(dir ==="prev"){
        this.index--;
        if(this.index<=0){
        this.prevBtn.addClass("unabled").removeClass("lightbox-prev-btn-show");	
        };
        if(this.index!=this.groupData.length-1){
        this.nextBtn.removeClass("unabled")
        };
        var src=this.groupData[this.index].src;
        this.loadPicSize(src);
        };

        },
      loadPicSize:function(sourceSrc){
        var self = this;
        self.popupPic.css({width:"auto",height:"auto"}).hide();

        this.preLoadImg(sourceSrc,function(){
        self.popupPic.attr("src",sourceSrc);
        var picWidth = self.popupPic.width(),
        picHeight = self.popupPic.height();

        console.log(picWidth+":"+picHeight);
        self.changePic(picWidth,picHeight);
        });
      },
      changePic:function(width,height){
        var self = this;
        winWidth = $(window).width(),
        winHeight =$(window).height(),

        //如果图片的宽高大于浏览器视口的宽高比例，就看下是否溢出
        scale = Math.min(winWidth/(width-10),winHeight/(height+10),1);

        width = width*scale;
        height =height*scale;


        this.picViewArea.animate({
        width:width-10,
        height:height-10
        });
        this.popupWin.animate({
        width:width,
        height:height,
        marginLeft:-(width/2),
        top:(winHeight-height)/2
        },function(){
        self.popupPic.css({
        width:width-10,
        height:height-10
        }).fadeIn();
        self.picCaptionArea.fadeIn();
        self.flag = true;
        });

        //设置描述文字和当前索引；
        //groupData
        this.captionText.text(this.groupData[this.index].caption);
        this.currentIndex.text("当前索引："+(this.index+1)+" of "+this.groupData.length);
      },

      //图片预加载
      preLoadImg:function(src,callback){
        var img = new Image();
        if(!!window.ActiveXObject){
        img.onreadystatechange = function(){
        if(this.readyState=="complete"){
        callback();
        };
        };
        }else{
        img.onload = function(){
        callback();
        };
        };
        img.src = src; 
      },
      showMaskAndPopup:function(sourceSrc,currentId){
        var self = this;
        this.popupPic.hide();
        this.picCaptionArea.hide();
        this.popupMask.fadeIn();
        var winWidth = $(window).width();
        var winHeight = $(window).height();

        this.picViewArea.css({
        width:winWidth / 2,
        height:winHeight /2
        });
        this.popupWin.fadeIn();
        this.popupWin.css({
        width:winWidth / 2 +10,
        height:winHeight /2 +10,
        marginLeft:-(winWidth / 2 +10)/2,
        top:-(winHeight /2 +10)
        }).animate({
        top:(winHeight-winHeight /2 -10)/2
        },function(){
        //遮罩层动画完毕后，根据图片大小调整遮罩层的回掉函数
         //加载图片
         self.loadPicSize(sourceSrc);
        });
        //根据当前点击的元素的ID获取在当前组别里面的索引
        this.index = this.getIndexOf(currentId);

        var groupDataLength = this.groupData.length;
        if(groupDataLength > 1){

        if(this.index === 0){
        this.prevBtn.addClass("unabled");
        this.nextBtn.removeClass("unabled");
        }else if(this.index === groupDataLength - 1){
        this.prevBtn.removeClass("unabled");
        this.nextBtn.addClass("unabled");
        }else{
        this.prevBtn.removeClass("unabled");
        this.nextBtn.removeClass("unabled");
        };
        };
      },

      getIndexOf:function(currentId){
        var index = 0;
        $(this.groupData).each(function(i){
        index = i;
        if(this.id ===currentId){
        return false;  //return类似于break操作，即忽略改操作
        };
        });
        return index;
      },
      initPopup:function(currentObj){
        var self = this,
        sourceSrc = currentObj.attr("data-source"),
        currentId = currentObj.attr("data-id");
        this.showMaskAndPopup(sourceSrc,currentId);
      },
      getGroup:function(){
        var self = this;
        //根据当前的组别名称获取页面中所有相同组别的对象
        var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");

        //清空数组数据
        self.groupData.length = 0;
        groupList.each(function(){

        self.groupData.push({
        src:$(this).attr("data-source"),
        id:$(this).attr("data-id"),
        caption:$(this).attr("data-caption"),
        });
        });
        console.log(self.groupData);
      },

      renderDOM:function(){
        var strDom = '<div class="lightbox-pic-view">'+
        '<span class="lightbox-btn lightbox-prev-btn"></span>'+
        '<img class="lightbox-img" src=" ">'+
        '<span class="lightbox-btn lightbox-next-btn"></span>'+
        '</div>'+
        '<div class="lightbox-pic-caption">'+
        '<div class="lightbox-caption-area">'+
        '<p class="lightbox-pic-desc"></p>'+
        '<span class="lightbox-of-index">当前索引：0 of 0</span>'+
        '</div>'+
        '<span class="lightbox-btn-close"></span>'+
        '</div>';
          //插入到this.popWin
      this.popupWin.html(strDom);
      //把遮罩层和弹出框插入到body
      this.bodyNode.append(this.popupMask,this.popupWin);
        },
	};
	window["LightBox"] = LightBox;
})(jQuery);