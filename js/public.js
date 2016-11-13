/**
 * Created by Administrator on 2016/8/2.
 */

$(function() {
    //================================常量=====================================
    var IMG__LAZY = 'img.lazy';
    var TITLE_PROWORK__A = '.title-prowork a';
    var CON_PROWORK__UL = '.con-prowork ul';
    var CON_PROWORK__LI = '.con-prowork li';


    //=================================函数=====================================
    /**
     * 图片懒加载
     */
    $(IMG__LAZY).lazyload({effect: "fadeIn"});


    /**
     * 作品切换效果
     */
    $(TITLE_PROWORK__A).each(function(i){
        $(this).on("click",function(){
            $(TITLE_PROWORK__A).removeClass("on");
            $(this).addClass("on");
            var oli = $(CON_PROWORK__LI);
            var oul = $(CON_PROWORK__UL);
            oli.removeClass("begin").removeClass("end");
            oul.eq(i).siblings().find("li").addClass("begin");
            setTimeout(function(){
                oul.hide();
                oul.eq(i).find("li").addClass("end")
                oul.eq(i).show();
            },500);
        });
    });

    /**
     * 搜索
     */
    $("#search-btn").on("click",function () {
        var val = $("#search-input").val();
        if(val){
            $(".block-style1").hide();
            $(".block-style1 .name").each(function () {
                var text = $(this).text();
                if(text.indexOf(val)!=-1){
                    $(this).parents(".block-style1").show();
                }
            });
        }else{
            $(".block-style1").show();
        }
    });
});
