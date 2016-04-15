(function(window, document) {
    var scroller = function() { return this; }
    
    scroller.prototype.parallax = {
        init: function(id) {
            document.addEventListener('DOMContentLoaded', function() {
                var el = document.getElementById(id) || document.getElementsByClassName(id)[0];
                
                if (typeof el !== 'undefined') {
                    this.event.bind(null, el)();
                    window.addEventListener('scroll', this.event.bind(null, el));
                } else {
                    console.log('Element not found: #' + id);
                }
            }.bind(this));
        },
        event: function(el) {
            el.setAttribute('style', 'transform: translate3d(0, ' + (window.pageYOffset / 3).toFixed(2) + 'px, 0)');
        }
    }
    
    scroller.prototype.hitPoint = function(_class, merge) {
        if (typeof merge == 'undefined') var merge = {};
        
        document.addEventListener('DOMContentLoaded', function() {
            var els         = document.getElementsByClassName(_class);
            var els_pos     = [];
            var els_state   = [];
            
            for(var i = 0;i < els.length;i++) {
                var top         = els[i].getBoundingClientRect();
                var body_top    = document.body.getBoundingClientRect().top;
                
                if (typeof top !== 'undefined' && top.top !== 'undefined') {
                    els_pos.push({
                        top: top.top - body_top + (merge.offset || parseInt(els[i].getAttribute('data-offset')) || 0),
                        bottom:top.bottom,
                        key: i,
                        add_class: merge.add_class || els[i].getAttribute('data-class') || null,
                        add_style: merge.add_style || els[i].getAttribute('data-style') || null,
                        height: els[i].offsetHeight
                    });
                }
            };
            
            if (els_pos !== []) {
                window.addEventListener('scroll', function() {
                    var scroll_top = window.pageYOffset + window.innerHeight;
                    
                    els_pos.map(function(item) {
                        var bool = scroll_top > item.top && window.pageYOffset < item.top;
    
                        if (bool && els_state[item.key] !== true) {
                            console.log('Scroll point hit');
                            els_state[item.key] = true;
                            
                            if (item.add_class !== null)
                                els[item.key].className += ' ' + item.add_class;
                        } else if (bool == false && els_state[item.key] == true) {
                            console.log('Left point');
                            els_state[item.key] = false;
                            
                            if (item.add_class !== null)
                                els[item.key].className = els[item.key].className.replace(' ' + item.add_class, '');
                        }
                    });
                });
                
                window.dispatchEvent(new CustomEvent('scroll'));
            }
        });
    }
    
    if (typeof module !== 'undefined' && module.exports) {
		module.exports = new scroller;
	} else {
		window.scroller = new scroller;
	}
}(window, document));