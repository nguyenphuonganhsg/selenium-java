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
import org.testng.annotations.Test;
//context menu
public class RightClickElement {
    private static WebDriver driver;
    @BeforeMethod
    static void setup(){
        //Step 1
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/context_menu");
    }

    @Test
    static void hoverElement1(){
        WebElement hotspot = driver.findElement(By.id("hot-spot"));

        Actions mouse = new Actions(driver); // perform action like mouse, keypad,
        mouse.contextClick(hotspot).perform();

        WebDriverWait wait = new WebDriverWait(driver, 10);
        Assert.assertTrue(wait.until(ExpectedConditions.alertIsPresent()) != null);

        String jsContext = driver.switchTo().alert().getText();
        driver.switchTo().alert().accept();
        System.out.println(jsContext);
        Assert.assertEquals(jsContext, "You selected a context menu");
    }

    @AfterMethod
    static  void tearDown(){
        driver.quit();
    }
}
