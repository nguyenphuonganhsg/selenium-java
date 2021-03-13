package browsers;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.util.HashMap;
import java.util.Map;

public class OpenChromeMobileMode {

    public static void main(String[] args) {
        System.setProperty("webdriver.chrome.driver","drivers/chromedriver.exe");
        Map<String, Object> mobileEmulation = new HashMap<>();
        mobileEmulation.put("deviceName", "Galaxy S5");
        ChromeOptions opts = new ChromeOptions();
        opts.setExperimentalOption("mobileEmulation", mobileEmulation);
        WebDriver driver = new ChromeDriver(opts);
        //fullsceen
            //driver.manage().window().fullscreen();
        //maximize
            //driver.manage().window().maximize();

        //navigate to address : get/navigate
        driver.get("http://google.com.vn");
        driver.manage().window().setSize(new Dimension( 500, 500));
        driver.navigate().to("https://selenium.dev");
        driver.navigate().back();
        driver.quit();
        // back, refresh, resize
    }
}
