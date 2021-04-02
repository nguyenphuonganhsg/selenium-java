package modules;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class Hyperlink {
    private static WebDriver driver;
    @BeforeMethod
    static void setup(){
        //Step 1
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/status_codes");
    }

    //cach theo kiểu data driven
    @DataProvider
    static Object[][] pages(){
        return new Object[][]{
                new Object[]{"200", "status_codes/200"},
                new Object[]{"301", "status_codes/301"},
                new Object[]{"404", "status_codes/404"},
                new Object[]{"500", "status_codes/500"}
        };
    }

    @Test(dataProvider = "pages")
    static void navigateToPage(String name, String expected){
        driver.findElement(By.linkText(name)).click();
        Assert.assertTrue(driver.getCurrentUrl().contains(expected));
        driver.findElement(By.linkText("here")).click();
    }

    @AfterMethod
    static  void tearDown(){
        Assert.assertTrue(driver.getCurrentUrl().contains("status_codes"));
        driver.quit();
    }
}
