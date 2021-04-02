package modules.JavascriptAlert;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class HoverElement {
    private static WebDriver driver;
    @BeforeMethod
    static void setup(){
        //Step 1
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/hovers");
    }

    @Test
    static void hoverElement1(){
        Actions mouse = new Actions(driver); // perform action like mouse, keypad,
        WebDriverWait wait = new WebDriverWait(driver, 10);

        WebElement avalta1 = driver.findElement(By.xpath("//div[@class='figure'][1]"));
        mouse.moveToElement(avalta1).perform();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='figure'][1]/div/h5"))).getText();
//        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@class='figure'][1]/div/h5"))).getText();

        String caption = avalta1.findElement(By.xpath("//div/h5")).getText();
        System.out.println(caption);
        Assert.assertEquals(caption, "name: user1");
    }

    @AfterMethod
    static  void tearDown(){
        driver.quit();
    }
}
