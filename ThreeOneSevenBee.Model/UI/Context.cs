﻿#if BRIDGE
using Bridge.Html5;
#else
using System;
#endif

namespace ThreeOneSevenBee.Model.UI
{
    public abstract class Context
    {
        public Context(double width, double height)
        {
            Width = width;
            Height = height;
        }

        public virtual double Width { get; protected set; }
        public virtual double Height { get; protected set; }

        private View _contentView;

        public abstract void Clear();

        public virtual void SetContentView(View view)
        {
            _contentView = view;
        }

        public void Draw()
        {
            Clear();
            _contentView.DrawWithContext(this, 0, 0);
        }

        public abstract void Draw(LabelView view, double offsetX, double offsetY);

        public abstract void Draw(ProgressbarStarView view, double offsetX, double offsetY);

        public virtual void Draw(ButtonView view, double offsetX, double offsetY)
        {
            Draw(view as LabelView, offsetX, offsetY);
        }
    }
}
