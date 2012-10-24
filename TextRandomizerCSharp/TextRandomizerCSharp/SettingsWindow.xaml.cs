using System.Windows;
using System.Windows.Interop;

namespace TextRandomizerCSharp
{
    /// <summary>
    /// Interaction logic for SettingsWindow.xaml
    /// </summary>
    public partial class SettingsWindow : Window
    {
        public RandomizerSettings Settings { get; private set; }
 
        public SettingsWindow(RandomizerSettings settings)
        {
            this.InitializeComponent();

            this.Properties.SelectedObject = settings;
        }

        private void OkButton_Click(object sender, RoutedEventArgs e)
        {
            this.Settings = this.Properties.SelectedObject as RandomizerSettings;

            if (ComponentDispatcher.IsThreadModal)
            {
                this.DialogResult = true;
            }
            this.Close();
        }
    }
}