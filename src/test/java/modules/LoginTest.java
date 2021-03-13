package modules;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginTest {
    public static void main(String[] args) {
        //step 1: web driver
        // System.setProperty("webdriver.chrome.driver","drivers/chromedriver.exe");
        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();

        //step 2 : access page
        driver.get("https://the-internet.herokuapp.com/login");

        //step 3:
        // Fill in password with SuperSecretPassword

        // find element ( at least 15 ways (*** LESS CODE LESS BUG ***)
        driver.findElement(By.id("username")).sendKeys("tomsmith");  // ***

        // driver.findElement(By.tagName("input")).sendKeys("tomsmith");

        // driver.findElement(By.name("username")).sendKeys("tomsmith");
        // driver.findElement(By.xpath("//input")).sendKeys("tomsmith3");
        // driver.findElement(By.cssSelector("input")).sendKeys("tomsmith33");
        // driver.findElement(By.xpath("//input[@name='username']")).sendKeys("tomsmith33");
        // driver.findElement(By.cssSelector("input[name=username]")).sendKeys("tomsmith33");
        // ...
        // ***** ***** ***** xpath Attribute ***** *****
        // xpath Attribute : 3 ways
        // get by 1 attr:   E[@A='t'] *****
        // ==> extent all E use *
        // //*E[@A='t']     => ex: //*input[@name='username']
        // ==> extent ==> //*[contains(@A,'t')]  => ex: //*[contains(@name,'username')]
        // driver.findElement(By.xpath("//input[@name='username']")).sendKeys("tomsmith33");

        //CSS
        // driver.findElement(By.cssSelector("input[name=username]")).sendKeys("tomsmith33");

        //Step 4:  Fill in password with SuperSecretPassword!
        driver.findElement(By.id("password")).sendKeys("SuperSecretPassword!");

        //Step 5: Click zô login button
        //driver.findElement(By.className("radius")).click();
       // driver.findElement(By.xpath("//button[@class='radius']")).click();
        // driver.findElement(By.xpath("//*[@class='radius']")).click(); //any tag have class name


//        driver.findElement(By.cssSelector("button.radius")).click();
//        driver.findElement(By.cssSelector(".radius")).click(); // any css have class name


        //driver.findElement(By.xpath("//button[@type='submit']")).click();// ***
        //driver.findElement(By.cssSelector("button[type=submit]")).click();

        //driver.findElement(By.xpath("//*[contains(@type,'submit')]")).click();
        //driver.findElement(By.cssSelector("button[type=submit]")).click();


        // find by text
        //driver.findElement(By.xpath("//*[.=' Login']")).click(); // = function text()=' Login'
        driver.findElement(By.xpath("//button[contains(.,'Login')]")).click(); //***

        //Step 6. Validate Check Home is Appear
        String currentUrl = driver.getCurrentUrl();
        if(currentUrl.contains("/secure")){
            System.out.println("TEST PASSSED!!!");
        } else {
            System.out.println("TEST FAILED!!!");
        }

        //driver.quit();
    }
}
