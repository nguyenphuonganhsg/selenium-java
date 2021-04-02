package modules.NestFrame;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class NestFrameClass {
    private static WebDriver driver;
    @BeforeMethod
    static void setup(){
        //Step 1
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/nested_frames");
    }

    @Test
    static void checkInnerText(){
        driver.switchTo().frame("frame-top");// or index 0 or find.byName("frame-top")
        driver.switchTo().frame("frame-left");
        Assert.assertTrue(driver.findElement(By.xpath("html/body")).getText().contains("LEFT"),
                driver.findElement(By.xpath("html/body")).getText());

        driver.switchTo().parentFrame(); // back to parent
        driver.switchTo().frame("frame-middle");
        Assert.assertTrue(driver.findElement(By.xpath("html/body")).getText().contains("MIDDLE"),
                driver.findElement(By.xpath("html/body")).getText());

        driver.switchTo().parentFrame(); // back to parent
        driver.switchTo().frame("frame-right");
        Assert.assertTrue(driver.findElement(By.xpath("html/body")).getText().contains("RIGHT"),
                driver.findElement(By.xpath("html/body")).getText());

        driver.switchTo().parentFrame(); // back to parent top
        driver.switchTo().parentFrame(); // back to parent main
        driver.switchTo().frame("frame-bottom");
        Assert.assertTrue(driver.findElement(By.xpath("html/body")).getText().contains("BOTTOM"),
                driver.findElement(By.xpath("html/body")).getText());

    }

    @AfterMethod
    static  void tearDown(){
        driver.quit();
    }

}
