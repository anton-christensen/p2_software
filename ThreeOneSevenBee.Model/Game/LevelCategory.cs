﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
#if BRIDGE
using Bridge.Html5;
#endif

namespace ThreeOneSevenBee.Model.Game
{
    /// <summary>
    ///  A collection of levels for a particular category
    /// </summary>
    public class LevelCategory : IEnumerable<Level>
    {
        // dictionary for mapping names to badges
        public static Dictionary<string, BadgeName> CategoryBadges = new Dictionary<string, BadgeName>()
        {
            { "Tutorial", BadgeName.tutorialBadge },
            { "Potenser", BadgeName.potensBadge },
            { "Brøker", BadgeName.brokBadge },
            { "Master of Algebra", BadgeName.masterOfAlgebra },
            { "Parenteser", BadgeName.parenthesisBadge},
        };
        public bool Completed
        {
            get
            {
                return levels.All((l) => l.Stars == l.StarExpressions.Count);
            }
        }
        public string Name;
        // each category contains a specific badge
        public BadgeName Badge
        {
            get
            {
                return CategoryBadges.ContainsKey(Name) ? CategoryBadges[Name] : default(BadgeName);
            }
        }
        public int categoryIndex;

        public int CategoryIndex {
            get
            { return categoryIndex; }
            set
            {
                categoryIndex = value;
                foreach (Level level in levels)
                {
                    level.CategoryIndex = categoryIndex;
                }
            }
        }
        private List<Level> levels;

        public LevelCategory(string name)
        {
            Name = name;
            levels = new List<Level>();
        }

        public void Add(Level level)
        {
            level.CategoryIndex = CategoryIndex;
            level.LevelIndex = levels.Count;
            levels.Add(level);
        }

        public IEnumerator<Level> GetEnumerator()
        {
            return levels.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
        
        public Level this[int index]
        {
            get
            {
                return levels[index];
            }

            set
            {
                levels[index] = value;
            }
        }

        public int Count
        {
            get { return levels.Count; }
        }

    }
}
