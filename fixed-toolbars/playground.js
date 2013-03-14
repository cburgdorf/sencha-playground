Ext.application({
    name: 'LazyInfiniteCarousel',

    launch: function() {

        var header = Ext.factory({
            xtype: 'container',
            style: 'background: red',
            height: 45,
            docked: 'top'
        });

        var content = Ext.factory({
            xtype: 'container',
            style: 'background: yellow',
            scrollable: 'vertical',
            html: "test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>test<br>foo<br>test<br>"
        });

        var footer = Ext.factory({
            xtype: 'container',
            style: 'background: green',
            height: 45,
            docked: 'bottom'
        });

        Ext.Viewport.add([
            header,
            content,
            footer
        ]);

    }
});