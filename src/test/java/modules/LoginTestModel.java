package modules;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import pages.LoginPage;

public class LoginTestModel extends BaseTest {
    @DataProvider
    static Object[][] credentials(){
        return  new Object[][]{
                new Object[]{"tomsmith", "SuperSecretPassword!", "/secure"},
                new Object[]{"tomsmith", "SuperSecretPassword@", "/login"}
        };
    }

    @Test(dataProvider = "credentials")
    public static void check(String username, String password, String expectedURL) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(username, password);

        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains(expectedURL));
    }
}
