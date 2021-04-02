package modules;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public class BaseTest {
    protected static WebDriver driver;

    @BeforeMethod
    static void setup(){
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
    }

    @AfterMethod
    static  void tearDown(){
        //driver.quit();
    }
}
