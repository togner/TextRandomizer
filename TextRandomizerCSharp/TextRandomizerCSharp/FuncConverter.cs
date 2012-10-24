using System;
using System.Globalization;
using System.Windows.Data;

namespace TextRandomizerCSharp
{
    /// <summary>
    /// Generic converter.
    /// </summary>
    /// <typeparam name="T">Type of the conversion input.</typeparam>
    /// <typeparam name="TResult">Type of the conversion output.</typeparam>
    public sealed class FuncConverter<T, TResult> : IValueConverter
    {
        private Func<T, TResult> m_converter;
        private Func<TResult, T> m_backConverter;

        /// <summary>
        /// Initializes a new instance of the FuncConverter class.
        /// </summary>
        /// <param name="converter">The function that performs the actual conversion.</param>
        public FuncConverter(Func<T, TResult> converter)
            : this(converter, null)
        {
        }

        /// <summary>
        /// Initializes a new instance of the FuncConverter class.
        /// </summary>
        /// <param name="converter">The function that performs the actual conversion.</param>
        /// <param name="backConverter">The function that performs the inverse conversion.</param>
        public FuncConverter(Func<T, TResult> converter, Func<TResult, T> backConverter)
        {
            this.m_converter = converter;
            this.m_backConverter = backConverter;
        }

        /// <summary>
        /// Conversion T > TResult.
        /// </summary>
        /// <param name="value">The value to convert.</param>
        /// <param name="targetType">The parameter is not used.</param>
        /// <param name="parameter">The parameter is not used.</param>
        /// <param name="culture">The parameter is not used.</param>
        /// <returns>Converted value of type TResult.</returns>
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (this.m_converter != null)
            {
                return this.m_converter((T)value);
            }
            else
            {
                return value;
            }
        }

        /// <summary>
        /// Inverse conversion (TResult > T).
        /// </summary>
        /// <param name="value">The value to convert back.</param>
        /// <param name="targetType">The parameter is not used.</param>
        /// <param name="parameter">The parameter is not used.</param>
        /// <param name="culture">The parameter is not used.</param>
        /// <returns>Converted value of type T.</returns>
        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (this.m_backConverter != null)
            {
                return this.m_backConverter((TResult)value);
            }
            else
            {
                return value;
            }
        }
    }
}
