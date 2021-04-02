package modules.BMICaculator;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class BMICaculatorWay3 {
    private static WebDriver driver;
    @BeforeMethod
    static void setup(){
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://www.calculator.net/bmi-calculator.html");
    }

    @Test
    static void calculator(){
        BMIPageWay3 bmiPage = new BMIPageWay3(driver);
        bmiPage.openMetricTab();
        bmiPage.fillForm("34","Female", "147", "50");
        Assert.assertEquals( bmiPage.getResult(),  "BMI = 23.1 kg/m2   (Normal)");
    }

    @AfterMethod
    static  void tearDown(){
       driver.quit();
    }
}
