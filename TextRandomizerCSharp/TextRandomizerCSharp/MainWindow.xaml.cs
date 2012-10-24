using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace TextRandomizerCSharp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private RandomizerSettings Settings { get; set; }
       
        public MainWindow()
        {
            this.InitializeComponent();

            Binding _isTextNotEmptyBinding = new Binding("Text")
            {
                Source = this.Text,
                Converter = new FuncConverter<string, bool>(_val => !string.IsNullOrWhiteSpace(_val))
            };
            this.SettingsButton.SetBinding(Button.IsEnabledProperty, _isTextNotEmptyBinding);
            this.RandomizeButton.SetBinding(Button.IsEnabledProperty, _isTextNotEmptyBinding);

            this.Settings = new RandomizerSettings()
            {
                ConsonantSwaps = 5,
                LanguageSet = Languages.English
            };
        }

        private void SettingsButton_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(this.Text.Text))
            {
                return;
            }
            SettingsWindow _settingsDialog = new SettingsWindow(new RandomizerSettings(this.Settings));
            if (true == _settingsDialog.ShowDialog())
            {
                this.Settings = _settingsDialog.Settings;
            }
        }

        private void RandomizeButton_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(this.Text.Text))
            {
                return;
            }
            this.Text.Text = Randomizer.Randomize(this.Text.Text, this.Settings);
        }
    }
}
