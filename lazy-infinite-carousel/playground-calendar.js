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

        var currentDay = moment();

        //retrieves an item from our source
        var getItem = function(position){
            return position === 'actual' ? currentDay.format('LLL') :
                position === 'next' ? currentDay.clone().add('days', 1).format('LLL') :
                    currentDay.clone().subtract('days', 1).format('LLL');
        };

        //a little helper function to create a new carousel item that will either
        //show the number at the current, the previous or the next index
        var createAt = function(position){
            return Ext.factory({
                xtype: 'container',
                html : '<div class="cc-carousel-date">' + getItem(position) + '</div>',
                style: 'background-color: ' + getRandomColor()
            });
        };

        //create an instance of the LazyCarousel
        me._carousel = Ext.create('CouchCommerce.view.LazyCarousel', {
            fullscreen: true,
            direction: 'horizontal',
            indicator: false,
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
            currentDay.add('days', 1);
        });

        me._carousel.on('movedbackward', function(){
            currentDay.subtract('days', 1);
        });

        //the LazyCarousel raises events when we need to put new items at the
        //head or tail of our carousel. That's what we do then..
        me._carousel.on('headneeded', function(){
            me._carousel.insertHead(createAt('next'));
        });

        me._carousel.on('tailneeded', function(){
            me._carousel.insertTail(createAt('previous'));
        });

    }
});