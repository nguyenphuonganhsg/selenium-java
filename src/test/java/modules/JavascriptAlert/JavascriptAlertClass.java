package modules.JavascriptAlert;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.sql.Driver;

public class JavascriptAlertClass {
    private static WebDriver driver;
    @BeforeMethod
    static void setup(){
        //Step 1
        WebDriverManager.chromedriver().setup();
        driver =  new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/javascript_alerts");
    }

    @Test
    static void clickForAlert(){
        driver.findElement(By.xpath("//button[.='Click for JS Alert']")).click();

        WebDriverWait wait = new WebDriverWait(driver, 10);
        Assert.assertTrue(wait.until(ExpectedConditions.alertIsPresent()) != null);

        driver.switchTo().alert().accept();

        String result = driver.findElement(By.id("result")).getText();
        System.out.println(result);
        Assert.assertEquals(result, "You successfully clicked an alert");
    }

    @DataProvider Object[][] confirmAction(){
        return new Object[][]{
                new Object[]{"Cancel"},
                new Object[]{"Ok"}
        };
    }
    @Test(dataProvider = "confirmAction")
    static void clickForConfirm(String action){
        driver.findElement(By.xpath("//button[.='Click for JS Confirm']")).click();

        WebDriverWait wait = new WebDriverWait(driver, 10);
        Assert.assertTrue(wait.until(ExpectedConditions.alertIsPresent()) != null);

        if(action.contains("Cancel"))
            driver.switchTo().alert().accept();
        else
            driver.switchTo().alert().dismiss();

        String result = driver.findElement(By.id("result")).getText();
        System.out.println(result);
        Assert.assertEquals(result, "You clicked: %s", action);
    }

    @Test
    static void clickForJsProm(){
        driver.findElement(By.xpath("//button[.='Click for JS Prompt']")).click();

        WebDriverWait wait = new WebDriverWait(driver, 10);
        Assert.assertTrue(wait.until(ExpectedConditions.alertIsPresent()) != null);

        driver.switchTo().alert().sendKeys("Hello");
        driver.switchTo().alert().accept();

        String result = driver.findElement(By.id("result")).getText();
        System.out.println(result);
 //       Assert.assertEquals(result, "You enter: Hello");
    }

    //String.format("status_codes/%s", name)) //cộng chuỗi
    @AfterMethod
    static  void tearDown(){
        driver.quit();
    }
}
