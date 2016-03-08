﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThreeOneSevenBee.Model.UI
{
    public abstract class View
    {
        public double Width { get; set; }
        public double Height { get; set; }
        public double X { get; set; }
        public double Y { get; set; }

        public abstract void DrawWithContext(Context context);

        public virtual void Click(int x, int y)
        {
            if(ContainsPoint(x, y))
            {
                OnClick();
            }
        }

        public Action OnClick;
        
        public virtual bool ContainsPoint(int x, int y)
        {
            return x >= X && y >= Y && x <= X + Width && y <= Y + Height;
        }
    }
}
