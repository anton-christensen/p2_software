﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ThreeOneSevenBee.Model.Game;
#if BRIDGE
using Bridge.Html5;
#endif

namespace ThreeOneSevenBee.Model.UI
{
    public class TutorialLevelView : LevelView
    {
        ToolTipView toolTipView;

        public TutorialLevelView(GameModel game, double width, double height) 
            : base(game, width, height)
        {
            Build(game);
        }

        public override void Build(GameModel game)
        {
            base.Build(game);
            toolTipView = new ToolTipView("Dette er en progressbar")
            {
                X = progressbar.X,
                Y = progressbar.Y,
                Width = 100,
                Height = 20
            };
            Children.Add(toolTipView);
        }
    }
}