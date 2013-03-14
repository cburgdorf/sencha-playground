Ext.application({
    name: 'LazyInfiniteCarousel',

    launch: function() {

        //just a function to produce a random color
        var getRandomColor = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return color;
        };

        var me = this;

        //a helper abstraction that makes circling through an array easier
        var CircleStore = function(vals){
            var that = this;

            that.vals = vals;

            that.setIndex = function(idx){
                that.idx = idx;
                return that.getValue();
            };

            that.getValue = function(){
                return that.getAtIndex(that.idx);
            };

            that.getAtIndex = function(index){
                return that.vals[index];
            };

            that.getPreviousIndex = function(baseIndex){
                return baseIndex === 0 ? that.vals.length - 1 : baseIndex - 1;
            };

            that.getNextIndex = function(baseIndex){
                return baseIndex === that.vals.length -1 ? 0 : baseIndex + 1;
            };

            that.getAtPrevious = function(){
                return that.getAtIndex(that.getPreviousIndex(that.idx));
            };

            that.getAtNext = function(){
                return that.getAtIndex(that.getNextIndex(that.idx));
            };

            that.moveForward = function(){
                that.idx = that.getNextIndex(that.idx);
                return that.getValue();
            };

            that.moveBackward = function(){
                that.idx = that.getPreviousIndex(that.idx);
                return that.getValue();
            };
        };


        //our array of values that we want to circle through *lazily*
        var values = [1,2,3,4,5,6,7,8,9];

        //a cache for carousel items to be recycled
        var itemCache = [];

        //wrap the values in our CircleStore abstraction
        var wrappedValues = new CircleStore(values);

        //we want to start at the middle (number 5)
        wrappedValues.setIndex(4);


        //retrieves an item from our source
        var getItem = function(position){
            return position === 'actual' ? wrappedValues.getValue() :
                   position === 'next' ? wrappedValues.getAtNext() :
                   wrappedValues.getAtPrevious();
        };

        //a little helper function to create a new carousel item that will either
        //show the number at the current, the previous or the next index
        var createAt = function(position){
            return Ext.factory({
                xtype: 'container',
                html : '<span class="cc-carousel-number">' + getItem(position) + '</span>',
                style: 'background-color: ' + getRandomColor()
            });
        };

        //creates an carousel item by either recycling an old one or creating
        //a new one
        var createAtWithCaching = function(position){

            var item = itemCache.pop();

            if (item){
                item.setHtml('<span class="cc-carousel-number">' + getItem(position) + '</span>');
            }

            if (!item){
                item = createAt(position);

            }
            return item;
        };

        //create an instance of the LazyCarousel
        me._carousel = Ext.create('CouchCommerce.view.LazyCarousel', {
            fullscreen: true,
            direction: 'horizontal',
            autoDestroy: false,
            defaults: {
                styleHtmlContent: true
            },

            //put the item at the center inside
            items: [createAt('actual')]
        });

        //now put the previous and the next inside
        me._carousel.insertTail(createAt('previous'))
        me._carousel.insertHead(createAt('next'))

        //when we swipe forward and backward we need to adjust the index in
        //our data source accordingly
        me._carousel.on('movedforward', function(){
            wrappedValues.moveForward();
        });

        me._carousel.on('movedbackward', function(){
            wrappedValues.moveBackward();
        });

        //the LazyCarousel raises events when we need to put new items at the
        //head or tail of our carousel. That's what we do then..
        me._carousel.on('headneeded', function(){
            me._carousel.insertHead(createAtWithCaching('next'));
        });

        me._carousel.on('tailneeded', function(){
            me._carousel.insertTail(createAtWithCaching('previous'));
        });

        me._carousel.on('itemremoved', function(origin, headOrTail, item){
            itemCache.push(item);
        });

    }
});