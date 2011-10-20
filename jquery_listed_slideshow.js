/*
 *  Project: jquery_listed_slideshow
 *  Description: A listed slideshow for jQuery
 *  Author: 
 *  License: 
 */


// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
    
    var pluginName = 'listed_slideshow',
        defaults = {
            cList: 'jls_list',
            cSlides: 'jls_slides',
            clSlide: 'jls-slide',
            clSlideImg: 'jls-slide-img',
            clSlideDesc: 'jls-slide-description',
            clSlider: 'jls-slider',
            hSlideDesc: '50px',
            transDuration: 500,
            transDescDuration: 500
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }
    
    /**
     * Initialize plugin
     */
    Plugin.prototype.init = function()
    {
        this.build();
        this.activateList();
    };
    
    /**
     * Build the slideshow area
     */
    Plugin.prototype.build = function()
    {      
        //set slides area to position: relative
        $('#'+this.options.cSlides).css('position', 'relative');
        
        //adapts images to slides area
        $('#'+this.options.cSlides+' img').each(this.resizeImage, [this.options])

        // create a div for every images
        $('#'+this.options.cSlides+' a').each(function(options){ 
            
            var img = $(this).next('img');
            
            //create a conteiner for a single slide
            var div = document.createElement('div');
            $(div).addClass(options.clSlide)
                .css({
                    'position': 'absolute',
                    'display': 'none', 
                    'width': '100%',
                    'text-align': 'center'
                })
                .append(this)
                .append(img);
            
            // create a bottom div for description
            var divDesc = document.createElement('div');
            $(divDesc).addClass(options.clSlideDesc)
                .css({
                   'position': 'absolute',
                   'width': '100%',
                   'text-align': 'left'
                });
            var pDesc = document.createElement('p');
            $(pDesc).html($(img).attr('alt'));
            $(divDesc).append(pDesc)
            $(div).append(divDesc);
            
            $('#'+options.cSlides).append(div);
        }, [this.options]);
        
        var divSlider = document.createElement('div');
        var objSlider = document.createElement('div');
        
        $('#'+this.options.cSlides).append(divSlider);
        $(divSlider).append(objSlider)
            .css({
                'position': 'absolute',
                'left': 0,
                'height': $('#'+this.options.cSlides).height()
            });
        $(objSlider).addClass(this.options.clSlider)
            .css('border-right-color', 'transparent');
        
        var mSlider = $(objSlider).css('border-right-width');
        $('#'+this.options.cSlides).css('margin-left', mSlider);
        $(divSlider).css('margin-left', '-'+mSlider);
    };
    
    /**
     * Activates list links
     */
    Plugin.prototype.activateList = function()
    {
        $('#'+this.options.cList+' li > a').bind('mouseover', {'options': this.options}, this.nextSlide);
    };
    
    /**
     * Run effects to for the next slide
     */
    Plugin.prototype.nextSlide = function(ev)
    {
        var name = $(this).attr('href').substring(1);
        $('#'+ev.data.options.cSlides+' div.active div')
            .animate({'height': '0px'})
            .end()
            .find('#'+ev.data.options.cSlides+' div.active')
            .fadeOut(ev.data.options.transDuration)
            .removeClass('active')
            .end()
            .find('a[name='+name+']').parent()
            .fadeIn(ev.data.options.transDuration)
            .addClass('active')
            .find('div')
            .animate({'height': ev.data.options.hSlideDesc});
        
        $('#'+ev.data.options.cSlides).animate({
           'border-color': $(this).css('color')
        });
        $('.'+ev.data.options.clSlider).animate({
           'border-right-color': $(this).css('color'),
           'margin-top':$(this).position()['top']
        })
    };
    
    /**
     * Resize an image to adapt it to the slides area
     * @param options
     */
    Plugin.prototype.resizeImage = function(options)
    {
        hSlide = $('#'+options.cSlides).height();
        wSlide = $('#'+options.cSlides).width();
        hImg = $(this).height();
        wImg = $(this).width();  
        
        var hImgScale, wImgScale;
        if(hImg > hSlide){
            hImgScale = (hImg-hSlide)*100/hImg;
            hImg = hSlide;
            wImg = wImg-(wImg/100*hImgScale);
        }
        else if(wImg > wSlide){
            wImgScale = (wImg-wSlide)*100/wImg;
            wImg = wSlide;
            hImg = hImg-(hImg/100*wImgScale);
        }
        
        $(this).height(hImg);
        $(this).width(wImg);
    }

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    }

})(jQuery, window, document);

