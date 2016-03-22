﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThreeOneSevenBee.Model.UI
{
    public class ProgressbarStar
    {
        private int _maxProgress;
        private int _currentProgress;

        public int Progress
        {
            get { return _currentProgress; }
            set { _currentProgress = value; }
        }

        public double Percentage
        {
            get { return (double)_currentProgress / _maxProgress; }
        }

        public int MaxProgress
        {
            get { return _maxProgress; }
            set { _maxProgress = value; }
        }

        public List<int> Stars;

        public ProgressbarStar(int progress, int maxValue, params int[] stars)
        {
            this._currentProgress = progress;
            this._maxProgress = maxValue;
            Stars = new List<int>(stars);
            GetStars();
        }

        public void Add(int star)
        {
            if (!Stars.Contains(star))
            {
                Stars.Add(star);
            }
        }

        public void Remove(int star)
        {
            if (Stars.Contains(star))
            {
                Stars.Remove(star);
            }
        }

        public int GetStars()
        {
            int starsCount = 0;
            int totalStars = 0;

            foreach (int i in Stars)
            {
                totalStars++;
                if (i <= _currentProgress)
                {
                    starsCount++;
                }
            }
            // Returns amount of reached stars.
            return starsCount;
        }
    }
}
