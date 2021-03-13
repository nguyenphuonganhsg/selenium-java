package browsers;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class OpenCocCocBrowser {

    public static void main(String[] args) {
        System.setProperty("webdriver.chrome.driver","drivers/chromedriver.exe");
        //  System.setProperty("webdriver.chrome.driver","C:/Users/WIN10/AppData/Local/CocCoc/Browser/Application/browser.exe");

        ChromeOptions opts = new ChromeOptions();
        opts.setBinary("C:/Users/WIN10/AppData/Local/CocCoc/Browser/Application/browser.exe");
        WebDriver driver = new ChromeDriver(opts);
        driver.get("http://google.com.vn");
        driver.navigate().to("https://selenium.dev");
        driver.navigate().back();
        driver.quit();
    }
}
