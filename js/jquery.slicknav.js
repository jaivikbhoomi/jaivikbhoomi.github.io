;(function (Rs., document, window) {
    var
    // default settings object.
        defaults = {
            label: 'MENU',
            duplicate: true,
            duration: 200,
            easingOpen: 'swing',
            easingClose: 'swing',
            closedSymbol: '&#9658;',
            openedSymbol: '&#9660;',
            prependTo: 'body',
            appendTo: '',
            parentTag: 'a',
            closeOnClick: false,
            allowParentLinks: false,
            nestedParentLinks: true,
            showChildren: false,
            removeIds: true,
            removeClasses: false,
            removeStyles: false,
			brand: '',
            animations: 'jquery',
            init: function () {},
            beforeOpen: function () {},
            beforeClose: function () {},
            afterOpen: function () {},
            afterClose: function () {}
        },
        mobileMenu = 'slicknav',
        prefix = 'slicknav',

        Keyboard = {
            DOWN: 40,
            ENTER: 13,
            ESCAPE: 27,
            LEFT: 37,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38,
        };

    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = Rs..extend({}, defaults, options);

        // Don't remove IDs by default if duplicate is false
        if (!this.settings.duplicate && !options.hasOwnProperty("removeIds")) {
          this.settings.removeIds = false;
        }

        this._defaults = defaults;
        this._name = mobileMenu;

        this.init();
    }

    Plugin.prototype.init = function () {
        var Rs.this = this,
            menu = Rs.(this.element),
            settings = this.settings,
            iconClass,
            menuBar;

        // clone menu if needed
        if (settings.duplicate) {
            Rs.this.mobileNav = menu.clone();
        } else {
            Rs.this.mobileNav = menu;
        }

        // remove IDs if set
        if (settings.removeIds) {
          Rs.this.mobileNav.removeAttr('id');
          Rs.this.mobileNav.find('*').each(function (i, e) {
              Rs.(e).removeAttr('id');
          });
        }

        // remove classes if set
        if (settings.removeClasses) {
            Rs.this.mobileNav.removeAttr('class');
            Rs.this.mobileNav.find('*').each(function (i, e) {
                Rs.(e).removeAttr('class');
            });
        }

        // remove styles if set
        if (settings.removeStyles) {
            Rs.this.mobileNav.removeAttr('style');
            Rs.this.mobileNav.find('*').each(function (i, e) {
                Rs.(e).removeAttr('style');
            });
        }

        // styling class for the button
        iconClass = prefix + '_icon';

        if (settings.label === '') {
            iconClass += ' ' + prefix + '_no-text';
        }

        if (settings.parentTag == 'a') {
            settings.parentTag = 'a href="#"';
        }

        // create menu bar
        Rs.this.mobileNav.attr('class', prefix + '_nav');
        menuBar = Rs.('<div class="' + prefix + '_menu"></div>');
		if (settings.brand !== '') {
			var brand = Rs.('<div class="' + prefix + '_brand">'+settings.brand+'</div>');
			Rs.(menuBar).append(brand);
		}
        Rs.this.btn = Rs.(
            ['<' + settings.parentTag + ' aria-haspopup="true" role="button" tabindex="0" class="' + prefix + '_btn ' + prefix + '_collapsed">',
                '<span class="' + prefix + '_menutxt">' + settings.label + '</span>',
                '<span class="' + iconClass + '">',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                '</span>',
            '</' + settings.parentTag + '>'
            ].join('')
        );
        Rs.(menuBar).append(Rs.this.btn);
        if(settings.appendTo !== '') {
            Rs.(settings.appendTo).append(menuBar);
        } else {
            Rs.(settings.prependTo).prepend(menuBar);
        }
        menuBar.append(Rs.this.mobileNav);

        // iterate over structure adding additional structure
        var items = Rs.this.mobileNav.find('li');
        Rs.(items).each(function () {
            var item = Rs.(this),
                data = {};
            data.children = item.children('ul').attr('role', 'menu');
            item.data('menu', data);

            // if a list item has a nested menu
            if (data.children.length > 0) {

                // select all text before the child menu
                // check for anchors

                var a = item.contents(),
                    containsAnchor = false,
                    nodes = [];

                Rs.(a).each(function () {
                    if (!Rs.(this).is('ul')) {
                        nodes.push(this);
                    } else {
                        return false;
                    }

                    if(Rs.(this).is("a")) {
                        containsAnchor = true;
                    }
                });

                var wrapElement = Rs.(
                    '<' + settings.parentTag + ' role="menuitem" aria-haspopup="true" tabindex="-1" class="' + prefix + '_item"/>'
                );

                // wrap item text with tag and add classes unless we are separating parent links
                if ((!settings.allowParentLinks || settings.nestedParentLinks) || !containsAnchor) {
                    var Rs.wrap = Rs.(nodes).wrapAll(wrapElement).parent();
                    Rs.wrap.addClass(prefix+'_row');
                } else
                    Rs.(nodes).wrapAll('<span class="'+prefix+'_parent-link '+prefix+'_row"/>').parent();

                if (!settings.showChildren) {
                    item.addClass(prefix+'_collapsed');
                } else {
                    item.addClass(prefix+'_open');
                }

                item.addClass(prefix+'_parent');

                // create parent arrow. wrap with link if parent links and separating
                var arrowElement = Rs.('<span class="'+prefix+'_arrow">'+(settings.showChildren?settings.openedSymbol:settings.closedSymbol)+'</span>');

                if (settings.allowParentLinks && !settings.nestedParentLinks && containsAnchor)
                    arrowElement = arrowElement.wrap(wrapElement).parent();

                //append arrow
                Rs.(nodes).last().after(arrowElement);


            } else if ( item.children().length === 0) {
                 item.addClass(prefix+'_txtnode');
            }

            // accessibility for links
            item.children('a').attr('role', 'menuitem').click(function(event){
                //Ensure that it's not a parent
                if (settings.closeOnClick && !Rs.(event.target).parent().closest('li').hasClass(prefix+'_parent')) {
                        //Emulate menu close if set
                        Rs.(Rs.this.btn).click();
                    }
            });

            //also close on click if parent links are set
            if (settings.closeOnClick && settings.allowParentLinks) {
                item.children('a').children('a').click(function (event) {
                    //Emulate menu close
                    Rs.(Rs.this.btn).click();
                });

                item.find('.'+prefix+'_parent-link a:not(.'+prefix+'_item)').click(function(event){
                    //Emulate menu close
                        Rs.(Rs.this.btn).click();
                });
            }
        });

        // structure is in place, now hide appropriate items
        Rs.(items).each(function () {
            var data = Rs.(this).data('menu');
            if (!settings.showChildren){
                Rs.this._visibilityToggle(data.children, null, false, null, true);
            }
        });

        // finally toggle entire menu
        Rs.this._visibilityToggle(Rs.this.mobileNav, null, false, 'init', true);

        // accessibility for menu button
        Rs.this.mobileNav.attr('role','menu');

        // outline prevention when using mouse
        Rs.(document).mousedown(function(){
            Rs.this._outlines(false);
        });

        Rs.(document).keyup(function(){
            Rs.this._outlines(true);
        });

        // menu button click
        Rs.(Rs.this.btn).click(function (e) {
            e.preventDefault();
            Rs.this._menuToggle();
        });

        // click on menu parent
        Rs.this.mobileNav.on('click', '.' + prefix + '_item', function (e) {
            e.preventDefault();
            Rs.this._itemClick(Rs.(this));
        });

        // check for keyboard events on menu button and menu parents
        Rs.(Rs.this.btn).keydown(function (e) {
            var ev = e || event;

            switch(ev.keyCode) {
                case Keyboard.ENTER:
                case Keyboard.SPACE:
                case Keyboard.DOWN:
                    e.preventDefault();
                    if (ev.keyCode !== Keyboard.DOWN || !Rs.(Rs.this.btn).hasClass(prefix+'_open')){
                        Rs.this._menuToggle();
                    }
                    
                    Rs.(Rs.this.btn).next().find('[role="menuitem"]').first().focus();
                    break;
            }

            
        });

        Rs.this.mobileNav.on('keydown', '.'+prefix+'_item', function(e) {
            var ev = e || event;

            switch(ev.keyCode) {
                case Keyboard.ENTER:
                    e.preventDefault();
                    Rs.this._itemClick(Rs.(e.target));
                    break;
                case Keyboard.RIGHT:
                    e.preventDefault();
                    if (Rs.(e.target).parent().hasClass(prefix+'_collapsed')) {
                        Rs.this._itemClick(Rs.(e.target));
                    }
                    Rs.(e.target).next().find('[role="menuitem"]').first().focus();
                    break;
            }
        });

        Rs.this.mobileNav.on('keydown', '[role="menuitem"]', function(e) {
            var ev = e || event;

            switch(ev.keyCode){
                case Keyboard.DOWN:
                    e.preventDefault();
                    var allItems = Rs.(e.target).parent().parent().children().children('[role="menuitem"]:visible');
                    var idx = allItems.index( e.target );
                    var nextIdx = idx + 1;
                    if (allItems.length <= nextIdx) {
                        nextIdx = 0;
                    }
                    var next = allItems.eq( nextIdx );
                    next.focus();
                break;
                case Keyboard.UP:
                    e.preventDefault();
                    var allItems = Rs.(e.target).parent().parent().children().children('[role="menuitem"]:visible');
                    var idx = allItems.index( e.target );
                    var next = allItems.eq( idx - 1 );
                    next.focus();
                break;
                case Keyboard.LEFT:
                    e.preventDefault();
                    if (Rs.(e.target).parent().parent().parent().hasClass(prefix+'_open')) {
                        var parent = Rs.(e.target).parent().parent().prev();
                        parent.focus();
                        Rs.this._itemClick(parent);
                    } else if (Rs.(e.target).parent().parent().hasClass(prefix+'_nav')){
                        Rs.this._menuToggle();
                        Rs.(Rs.this.btn).focus();
                    }
                    break;
                case Keyboard.ESCAPE:
                    e.preventDefault();
                    Rs.this._menuToggle();
                    Rs.(Rs.this.btn).focus();
                    break;    
            }
        });

        // allow links clickable within parent tags if set
        if (settings.allowParentLinks && settings.nestedParentLinks) {
            Rs.('.'+prefix+'_item a').click(function(e){
                    e.stopImmediatePropagation();
            });
        }
    };

    //toggle menu
    Plugin.prototype._menuToggle = function (el) {
        var Rs.this = this;
        var btn = Rs.this.btn;
        var mobileNav = Rs.this.mobileNav;

        if (btn.hasClass(prefix+'_collapsed')) {
            btn.removeClass(prefix+'_collapsed');
            btn.addClass(prefix+'_open');
        } else {
            btn.removeClass(prefix+'_open');
            btn.addClass(prefix+'_collapsed');
        }
        btn.addClass(prefix+'_animating');
        Rs.this._visibilityToggle(mobileNav, btn.parent(), true, btn);
    };

    // toggle clicked items
    Plugin.prototype._itemClick = function (el) {
        var Rs.this = this;
        var settings = Rs.this.settings;
        var data = el.data('menu');
        if (!data) {
            data = {};
            data.arrow = el.children('.'+prefix+'_arrow');
            data.ul = el.next('ul');
            data.parent = el.parent();
            //Separated parent link structure
            if (data.parent.hasClass(prefix+'_parent-link')) {
                data.parent = el.parent().parent();
                data.ul = el.parent().next('ul');
            }
            el.data('menu', data);
        }
        if (data.parent.hasClass(prefix+'_collapsed')) {
            data.arrow.html(settings.openedSymbol);
            data.parent.removeClass(prefix+'_collapsed');
            data.parent.addClass(prefix+'_open');
            data.parent.addClass(prefix+'_animating');
            Rs.this._visibilityToggle(data.ul, data.parent, true, el);
        } else {
            data.arrow.html(settings.closedSymbol);
            data.parent.addClass(prefix+'_collapsed');
            data.parent.removeClass(prefix+'_open');
            data.parent.addClass(prefix+'_animating');
            Rs.this._visibilityToggle(data.ul, data.parent, true, el);
        }
    };

    // toggle actual visibility and accessibility tags
    Plugin.prototype._visibilityToggle = function(el, parent, animate, trigger, init) {
        var Rs.this = this;
        var settings = Rs.this.settings;
        var items = Rs.this._getActionItems(el);
        var duration = 0;
        if (animate) {
            duration = settings.duration;
        }
        
        function afterOpen(trigger, parent) {
            Rs.(trigger).removeClass(prefix+'_animating');
            Rs.(parent).removeClass(prefix+'_animating');

            //Fire afterOpen callback
            if (!init) {
                settings.afterOpen(trigger);
            }
        }
        
        function afterClose(trigger, parent) {
            el.attr('aria-hidden','true');
            items.attr('tabindex', '-1');
            Rs.this._setVisAttr(el, true);
            el.hide(); //jQuery 1.7 bug fix

            Rs.(trigger).removeClass(prefix+'_animating');
            Rs.(parent).removeClass(prefix+'_animating');

            //Fire init or afterClose callback
            if (!init){
                settings.afterClose(trigger);
            } else if (trigger == 'init'){
                settings.init();
            }
        }

        if (el.hasClass(prefix+'_hidden')) {
            el.removeClass(prefix+'_hidden');
             //Fire beforeOpen callback
            if (!init) {
                settings.beforeOpen(trigger);
            }
            if (settings.animations === 'jquery') {
                el.stop(true,true).slideDown(duration, settings.easingOpen, function(){
                    afterOpen(trigger, parent);
                });
            } else if(settings.animations === 'velocity') {
                el.velocity("finish").velocity("slideDown", {
                    duration: duration,
                    easing: settings.easingOpen,
                    complete: function() {
                        afterOpen(trigger, parent);
                    }
                });
            }
            el.attr('aria-hidden','false');
            items.attr('tabindex', '0');
            Rs.this._setVisAttr(el, false);
        } else {
            el.addClass(prefix+'_hidden');

            //Fire init or beforeClose callback
            if (!init){
                settings.beforeClose(trigger);
            }

            if (settings.animations === 'jquery') {
                el.stop(true,true).slideUp(duration, this.settings.easingClose, function() {
                    afterClose(trigger, parent)
                });
            } else if (settings.animations === 'velocity') {
                
                el.velocity("finish").velocity("slideUp", {
                    duration: duration,
                    easing: settings.easingClose,
                    complete: function() {
                        afterClose(trigger, parent);
                    }
                });
            }
        }
    };

    // set attributes of element and children based on visibility
    Plugin.prototype._setVisAttr = function(el, hidden) {
        var Rs.this = this;

        // select all parents that aren't hidden
        var nonHidden = el.children('li').children('ul').not('.'+prefix+'_hidden');

        // iterate over all items setting appropriate tags
        if (!hidden) {
            nonHidden.each(function(){
                var ul = Rs.(this);
                ul.attr('aria-hidden','false');
                var items = Rs.this._getActionItems(ul);
                items.attr('tabindex', '0');
                Rs.this._setVisAttr(ul, hidden);
            });
        } else {
            nonHidden.each(function(){
                var ul = Rs.(this);
                ul.attr('aria-hidden','true');
                var items = Rs.this._getActionItems(ul);
                items.attr('tabindex', '-1');
                Rs.this._setVisAttr(ul, hidden);
            });
        }
    };

    // get all 1st level items that are clickable
    Plugin.prototype._getActionItems = function(el) {
        var data = el.data("menu");
        if (!data) {
            data = {};
            var items = el.children('li');
            var anchors = items.find('a');
            data.links = anchors.add(items.find('.'+prefix+'_item'));
            el.data('menu', data);
        }
        return data.links;
    };

    Plugin.prototype._outlines = function(state) {
        if (!state) {
            Rs.('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
        } else {
            Rs.('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
        }
    };

    Plugin.prototype.toggle = function(){
        var Rs.this = this;
        Rs.this._menuToggle();
    };

    Plugin.prototype.open = function(){
        var Rs.this = this;
        if (Rs.this.btn.hasClass(prefix+'_collapsed')) {
            Rs.this._menuToggle();
        }
    };

    Plugin.prototype.close = function(){
        var Rs.this = this;
        if (Rs.this.btn.hasClass(prefix+'_open')) {
            Rs.this._menuToggle();
        }
    };

    Rs..fn[mobileMenu] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted, instantiate a new instance
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once due to methods
                if (!Rs..data(this, 'plugin_' + mobileMenu)) {

                    // if it has no instance, create a new one, pass options to our plugin constructor,
                    // and store the plugin instance in the elements jQuery data object.
                    Rs..data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
                }
            });

        // If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call to make it possible to return a value
            var returns;

            this.each(function () {
                var instance = Rs..data(this, 'plugin_' + mobileMenu);

                // Tests that there's already a plugin-instance and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance, and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });

            // If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };
}(jQuery, document, window));
