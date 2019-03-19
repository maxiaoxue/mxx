<template>
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>

            <div class="pswp__ui pswp__ui--hidden">
                <div class="pswp__top-bar">
                    <div class="pswp__counter"></div>
                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PhotoSwipe from 'photoswipe'
    import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
    import "photoswipe/dist/photoswipe.css"
    import "photoswipe/dist/default-skin/default-skin.css"

    export default {
        data() {
            return {
                flowPic: {
                    src: '',
                    w: 0,
                    h: 0
                }
            }
        },
        props: {
            swipeItems: {
                type: Array,
                required: true
            },
            swipeIndex: {
                type: String,
                required: true
            },
            pkAttachLs: {
                type: Array,
                required: true
            },

            pkImageLs: {
                type: Array,
                required: true
            }
        },
        methods: {
            openPhotoSwipe(imageLs,attachLs, items, index) {
                if(items.length) {
                    var gallery = new PhotoSwipe(document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, items, {
                        history: true,
                        focus: false,
                        showAnimationDuration: 0,
                        hideAnimationDuration: 0
                    });
                    gallery.init();
                    this.loadImgInfo(gallery, imageLs,attachLs, items, index);
                    gallery.goTo(index);
                    gallery.listen('afterChange', () => {
                        this.loadImgInfo(gallery,imageLs, attachLs, items, gallery.getCurrentIndex());
                    });
                }
            },
            loadImgInfo(gallery,imageLs, attachLs, items, cIndex) {
                if(!items[cIndex].src) {

                    if(imageLs.length){

                        const params = {
                            "docname": imageLs[cIndex].docname,
                            "busiserailno": imageLs[cIndex].busiserailno,
                            "fileName":imageLs[cIndex].fileName
                        };
                        this.ajax.get(this.$store.getters.imageUrl, params, (data) => {
                            var data = data.data,
                                host = location.protocol + '//' + location.host;

                            items[cIndex].src = host + data.url;
                            items[cIndex].w = parseInt(data.width || 900);
                            items[cIndex].h = parseInt(data.height || 600);

                            gallery.invalidateCurrItems();
                            gallery.updateSize(true);
                        });
                    }
                    if(attachLs.length){
                        const params = {
                            "billtype": this.$store.getters.billType,
                            "pk_attachment": attachLs[cIndex]
                        };
                        this.ajax.get(this.$store.getters.atUrl, params, (data) => {
                            var data = data.data,
                                host = location.protocol + '//' + location.host;

                            items[cIndex].src = host + data.url;
                            items[cIndex].w = parseInt(data.width || 900);
                            items[cIndex].h = parseInt(data.height || 600);

                            gallery.invalidateCurrItems();
                            gallery.updateSize(true);
                        });
                    }
                }
            },

            openFlowPic(flowPic) {
                var flowPicture = new PhotoSwipe(
                    document.querySelectorAll('.pswp')[0],
                    PhotoSwipeUI_Default,
                    [flowPic],
                    {
                        history: false,
                        focus: false,
                        showAnimationDuration: 0,
                        hideAnimationDuration: 0
                    }
                );
                flowPicture.init();

                if(!flowPic.src) {
                    const params = {
                        "billid": this.$store.getters.billId,
                        "billtype": this.$store.getters.billType,
                        "ts": this.$store.getters.billTs
                    };
                    this.ajax.get(this.$store.getters.chartUrl, params, (data) => {
                        var data = data.data,
                            host = location.protocol + '//' + location.host;

                        flowPic.src = host + data.imgurl;

                        if(data.width && data.height) {
                            flowPic.w = parseInt(data.width);
                            flowPic.h = parseInt(data.height);
                        } else {
                            var virtualImg = new Image();
                            virtualImg.src = host + data.imgurl;

                            virtualImg.onload = function() {
                                flowPic.w = virtualImg.width;
                                flowPic.h = virtualImg.height;

                                flowPicture.invalidateCurrItems();
                                flowPicture.updateSize(true);

                                virtualImg = null;
                            };
                        }
                    });
                }
            }
        },
        watch: {
            swipeIndex(val) {
                // val，如："0_*$*_1515405644229"
                // _*$*_之前是指定图片的索引（传参之前需要截取），默认为0；之后是当前时间戳。
                // 根据时间戳的变化调用以下方法
                if(val.indexOf('$*$_true') > -1) {
                    this.openFlowPic(this.flowPic);
                } else {
                    this.openPhotoSwipe(
                        this.pkImageLs,
                        this.pkAttachLs,
                        this.swipeItems,
                        parseInt( val.slice( 0, val.indexOf('_*$*_') ) )
                    );
                }
            }
        }
    }
</script>