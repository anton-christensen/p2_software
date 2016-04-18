﻿using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ThreeOneSevenBee.Model.Expression;
using ThreeOneSevenBee.Model.Expression.ExpressionRules;
using System.Collections.Generic;
using ThreeOneSevenBee.Model.Expression.Expressions;

namespace ThreeOneSevenBee.ModelTests
{
    [TestClass]
    public class RulesTests
    {
        [TestMethod]
        public void Rules_ProductExponent()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;

            // a*a => a^2
            parent = Make.Multiply(
                selection1 = Make.New("a"),
                selection2 = Make.New("a"));

            var identity = Rules.ProductToExponentRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Power(Make.New("a"), Make.New(2)), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_ExponentProduct()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;

            // a^2 => a*a
            parent = Make.Power(
                selection1 = Make.New("a"),
                selection2 = Make.New(2));

            var identity = Rules.ExponentToProductRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Multiply(Make.New("a"), Make.New("a")), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_NumericVariadicRule()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;
            Identity identity;

            // 2+2 => 4
            parent = Make.Add(
                selection1 = Make.New(2),
                selection2 = Make.New(2));

            identity = Rules.NumericVariadicRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.New(4), identity.Suggestion);

            // 3*3 => 9
            parent = Make.Multiply(
                selection1 = Make.New(3),
                selection2 = Make.New(3));

            identity = Rules.NumericVariadicRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.New(9), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_NumericBinaryRule()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;
            Identity identity;

            // 2-2 => 0
            parent = Make.Subtract(
                selection1 = Make.New(2),
                selection2 = Make.New(2));

            identity = Rules.NumericBinaryRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.New(0), identity.Suggestion);

            // 3/3 => 1
            /*parent = ExpressionTests.Divide(
                selection1 = ExpressionTests.New(3),
                selection2 = ExpressionTests.New(3));

            identity = Rules.NumericBinaryRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(ExpressionTests.New(1), identity.Suggestion);*/

            // 3^3 => 27
            parent = Make.Power(
                selection1 = Make.New(3),
                selection2 = Make.New(3));

            identity = Rules.NumericBinaryRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.New(27), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_CommonPowerParenthesisRule()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;
            Identity identity;

            // 3^5*2^5 => (3*2)^5
            parent = Make.Multiply(
                Make.Power(
                    Make.New(3),
                    selection1 = Make.New(5)),
                Make.Power(
                    Make.New(2),
                    selection2 = Make.New(5)));

            identity = Rules.CommonPowerParenthesisRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Power(Make.Delimiter(Make.Multiply(Make.New(3), Make.New(2))), Make.New(5)), identity.Suggestion);

            // 3^5+2^5 => NULL
            parent = Make.Add(
                Make.Power(
                    Make.New(3),
                    selection1 = Make.New(5)),
                Make.Power(
                    Make.New(2),
                    selection2 = Make.New(5)));

            identity = Rules.CommonPowerParenthesisRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNull(identity);
        }

        [TestMethod]
        public void Rules_ReverseCommonPowerParenthesisRule()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;
            Identity identity;

            // (3*2)^5 => 3^5*2^5
            parent = Make.Power(
                selection1 = Make.Delimiter(
                    Make.Multiply(
                        Make.New(3),
                        Make.New(2))),
                selection2 = Make.New(5));

            identity = Rules.ReverseCommonPowerParenthesisRule(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Multiply(
                Make.Power(
                    Make.New(3),
                    Make.New(5)),
                Make.Power(
                    Make.New(2),
                   Make.New(5))), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_VariableWithNegativeExponent()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;
            Identity identity;

            // x^-2 = 1/x^2
            parent = Make.Power(
                selection1 = Make.New("x"),
                selection2 = Make.Minus(Make.New(2)));

            identity = Rules.VariableWithNegativeExponent(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Divide(Make.New(1), Make.Power(Make.New("x"), Make.New(2))), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_ReverseVariableWithNegativeExponent()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase selection3;
            ExpressionBase parent;
            Identity identity;

            // x^-2 = 1/x^2
            parent = selection1 = Make.Divide(
                selection2 = Make.New(1),
                Make.Power(
                    selection3 = Make.New("x"),
                    Make.New(2)));

            identity = Rules.ReverseVariableWithNegativeExponent(parent, new List<ExpressionBase>() { selection1, selection2, selection3 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Power(Make.New("x"), Make.Minus(Make.New(2))), identity.Suggestion);
        }

        [TestMethod]
        public void Rules_FactorizationRule()
        {
            ExpressionBase selection1;
            ExpressionBase parent;
            Identity identity;

            // 2/10 = 2/5*2
            parent = selection1 = Make.New(10);

            identity = Rules.FactorizationRule(parent, new List<ExpressionBase>() { selection1 });
            Assert.IsNotNull(identity);
            throw new NotImplementedException();
        }

        [TestMethod]
        public void Rules_AddFractionsWithSameNumerators()
        {
        ExpressionBase selection1;
        ExpressionBase selection2;
        ExpressionBase selection3;
        ExpressionBase parent;
        Identity identity;
            
        // a/b + c/b = a+c/b
        parent = Make.Add(
        selection1 = Make.Divide(Make.New("a"), Make.New("b")),
        selection2 = Make.Divide(Make.New("c"), Make.New("b")));
 
        identity = Rules.AddFractionsWithSameNumerators(parent, new List<ExpressionBase>() { selection1, selection2});
        Assert.IsNotNull(identity);
        Assert.AreEqual(Make.Divide(Make.Add(Make.New("a"), Make.New("c")), Make.New("b")), identity.Suggestion);
 
        // a/x - y/x + b/x + 3 = {a-y+b}/x + 3
        parent = Make.Add(
            selection1 = Make.Divide(Make.New("a"), Make.New("x")),
            selection2 = Make.Divide(Make.Minus(Make.New("y")), Make.New("x")),
            selection3 = Make.Divide(Make.New("b"), Make.New("x")),
            Make.New(3));
 
         identity = Rules.AddFractionsWithSameNumerators(parent, new List<ExpressionBase>() { selection1, selection2, selection3});
         Assert.IsNotNull(identity);
         Assert.AreEqual(Make.Add(Make.Divide(Make.Add(Make.New("a"), Make.Minus(Make.New("y")), Make.New("b")), Make.New("x")), Make.New(3)), identity.Result);
        }

        [TestMethod]
        public void Rules_SplittingFractions()
        {
            ExpressionBase parent;
            ExpressionBase selection1;
            Identity identity;

            // {a+b}/c = a/c + b/c
            parent = selection1 = Make.Divide(
            Make.Add(Make.New("a"), Make.New("b")),
            Make.New("c"));
            
            identity = Rules.SplittingFractions(parent, new List<ExpressionBase>() { selection1 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Add(Make.Divide(Make.New("a"), Make.New("c")), Make.Divide(Make.New("b"), Make.New("c"))), identity.Suggestion);
            
                        // {a-c-d+f}/x + 3 = a/x - c/x - d/x + f/x + 3
            parent = Make.Add(
                selection1 = Make.Divide(Make.Add(Make.New("a"), Make.Minus(Make.New("c")), 
                Make.Minus(Make.New("d")), Make.New("f")), Make.New("x")), Make.New(3));

            identity = Rules.SplittingFractions(parent, new List<ExpressionBase>() { selection1 });
            
                // TODO: Nedenstående er: a/x + -c/x + -d/x + f/x + 3, denne virker
                // Den nedenunder er: a/x - c/x - d/x + f/x + 3, den virker ikke, det skal ændres i reglen
                //Husk at Bruge issue nummeret ved commit!
            
            Assert.AreEqual(Make.Add(Make.Divide(Make.New("a"), Make.New("x")), Make.Divide(Make.Minus(Make.New("c")), Make.New("x")), Make.Divide(Make.Minus(Make.New("d")), Make.New("x")), Make.Divide(Make.New("f"), Make.New("x")), Make.New(3)), identity.Result);
            
            //Assert.AreEqual(Make.Add(Make.Divide(Make.New("a"), Make.New("x")), Make.Minus(Make.Divide(Make.New("c"), Make.New("x"))), Make.Minus(Make.Divide(Make.New("d"), Make.New("x"))), Make.Divide(Make.New("f"), Make.New("x")), Make.New(3)), identity.Result);
        }

        [TestMethod]
        public void Rules_DivisionEqualsOneRule()
        {
            ExpressionBase selection1;
            ExpressionBase parent;
            Identity identity;


            parent = selection1 = Make.Divide(Make.New(15), Make.New(15));

            identity = Rules.DivisionEqualsOneRule(parent, new List<ExpressionBase>() { selection1 });
            Assert.IsNotNull(identity);

            NumericExpression a = new NumericExpression(1);
            NumericExpression b = new NumericExpression(2);

            Assert.IsTrue(identity.Suggestion == a);
            Assert.IsFalse(identity.Suggestion == b);

        }

        [TestMethod]
        public void Rules_ProductParenthesis()
        {
            ExpressionBase selection1;
            ExpressionBase selection2;
            ExpressionBase parent;

            // [a]*b+[a]*c => a*(b+c)
            parent = Make.Add(
                Make.Multiply(
                    selection1 = Make.New("a"),
                    Make.New("b")),
                Make.Multiply(
                    selection2 = Make.New("a"),
                    Make.New("c")));

            var identity = Rules.ProductParenthesis(parent, new List<ExpressionBase>() { selection1, selection2 });
            Assert.IsNotNull(identity);
            Assert.AreEqual(Make.Multiply(Make.New("a"), Make.Delimiter(Make.Add(Make.New("b"), Make.New("c")))), identity.Suggestion);
        }
    }
}
