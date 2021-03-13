package modules;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.lang.annotation.Target;

public class LoginTestFinal {

    //1 test case need DATA, ACTION & CHECK VALIDATION ASSERT
    @Test
    public static void validCredentials() {
        //step 1: web driver
        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();

        //step 2 : access page
        driver.get("https://the-internet.herokuapp.com/login");

        //step 3: Fill in password with SuperSecretPassword
        driver.findElement(By.id("username")).sendKeys("tomsmith");  // ***

        //Step 4:  Fill in password with SuperSecretPassword!
        driver.findElement(By.id("password")).sendKeys("SuperSecretPassword!");

        //Step 5: Click zô login button
        driver.findElement(By.xpath("//button[contains(.,'Login')]")).click(); //***

        //Step 6. Validate Check Home is Appear
        String currentUrl = driver.getCurrentUrl();
        //Assert.assertEquals(currentUrl, "https://the-internet.herokuapp.com/secure");
        Assert.assertTrue(currentUrl.contains("/secure"));
    }

    @Test(description = "invalid")
    public static void invalidCredentials() {
        //step 1: web driver
        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();

        //step 2 : access page
        driver.get("https://the-internet.herokuapp.com/login");

        //step 3: Fill in password with SuperSecretPassword
        driver.findElement(By.id("username")).sendKeys("tomsmith");  // ***

        //Step 4:  Fill in password with SuperSecretPassword!
        driver.findElement(By.id("password")).sendKeys("SuperSecretPassword***");

        //Step 5: Click zô login button
        driver.findElement(By.xpath("//button[contains(.,'Login')]")).click(); //***

        //Step 6. Validate Check Home is NOT Appear
        String currentUrl = driver.getCurrentUrl();
        //Assert.assertEquals(currentUrl, "https://the-internet.herokuapp.com/secure");
        Assert.assertFalse(currentUrl.contains("/secure"));
        //driver.quit();
    }
}
