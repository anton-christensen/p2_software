﻿using Bridge;
using Bridge.Html5;
using ThreeOneSevenBee.Model;
using ThreeOneSevenBee.Model.UI;
using ThreeOneSevenBee.Model.Expression;
using ThreeOneSevenBee.Model.Expression.ExpressionRules;
using System.Collections.Generic;
using ThreeOneSevenBee.Model.Euclidean;
using ThreeOneSevenBee.Model.Game;


namespace ThreeOneSevenBee.Frontend
{
    public class App
    {
        [Ready]
        public static void Main()
        {
            Document.AddEventListener(EventType.TouchMove, (e) => {
                e.PreventDefault();
            });


            CanvasElement canvas = Document.GetElementById<CanvasElement>("canvas");
            canvas.Width = Document.DocumentElement.ClientWidth;
            canvas.Height = Document.DocumentElement.ClientHeight;
            InputElement input = Document.GetElementById<InputElement>("input");

            IContext context = new CanvasContext(canvas, input);

            IGameAPI gameAPI = new JQueryGameAPI();

            Game game = new Game(context, gameAPI);

            game.Start();
        }
    }
}