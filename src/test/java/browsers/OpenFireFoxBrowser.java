package browsers;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class OpenFireFoxBrowser {
    public static void main(String[] args) {
        //cach 1 tu set directory
        //System.setProperty("webdriver.gecko.driver","drivers/geckodriver.exe");
        //cach 2 use webdrivermanager
        // cach 3: copy webdriver to windows/system32
        //WebDriverManager.firefoxdriver().setup();

        // ==> System.setProperty mean: set library to ONE OF file PATH folder
        WebDriver driver = new FirefoxDriver();
    }
}
