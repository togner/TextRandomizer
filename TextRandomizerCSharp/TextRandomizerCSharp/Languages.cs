using Xceed.Wpf.Toolkit.PropertyGrid.Attributes;

namespace TextRandomizerCSharp
{
    public class Languages : IItemsSource
    {
        public static readonly LanguageSet English = new LanguageSet("bcdfghjklmnpqrstvwxyz", "aeiou");

        // no q, x, w, dz, dž ch
        public static readonly LanguageSet Slovak = new LanguageSet("bcčdďfghjklĺľmnňprŕsštťvzž", "aáäeéiíuúoóôyý");

        public Xceed.Wpf.Toolkit.PropertyGrid.Attributes.ItemCollection GetValues()
        {
            Xceed.Wpf.Toolkit.PropertyGrid.Attributes.ItemCollection _languages = new Xceed.Wpf.Toolkit.PropertyGrid.Attributes.ItemCollection();
            _languages.Add(Languages.English, "English");
            _languages.Add(Languages.Slovak, "Slovak");
            return _languages;
        }
    }
}
