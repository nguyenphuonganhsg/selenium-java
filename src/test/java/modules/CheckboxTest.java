package modules;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WrapsElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import pages.CheckboxPage;

public class CheckboxTest extends BaseTest{
    @DataProvider
    static Object[][] checkboxList(){
        return  new Object[][]{
                new Object[]{By.xpath("//form[@id='checkboxes']/input[1]"), true},
                new Object[]{By.xpath("//form[@id='checkboxes']/input[2]"), false}
        };
    }

    @Test(dataProvider = "checkboxList")
    void validateCheckboxIsChecked(By xPath, boolean expect){
        CheckboxPage ckbPage = new CheckboxPage(driver);
        ckbPage.open();

        Assert.assertEquals(ckbPage.validateCheckboxChecked(xPath), expect);
    }

}

