/**
 * Created by Administrator on 2016/8/2.
 */

$(function() {
    /**
     * 图片懒加载
     */
    $("img.lazy").lazyload({effect: "fadeIn"});


    /**
     * 作品切换效果
     */
    $(".title-prowork a").each(function(i){
        $(this).on("click",function(){
            $(".title-prowork a").removeClass("on");
            $(this).addClass("on");
            var oli = $(".con-prowork li");
            var oul = $(".con-prowork ul");
            oli.removeClass("benin").removeClass("end");
            oul.eq(i).siblings().find("li").addClass("begin");
            setTimeout(function(){
                oul.hide();
                oul.eq(i).find("li").addClass("end")
                oul.eq(i).show();
            },500);
        });
    });
});
