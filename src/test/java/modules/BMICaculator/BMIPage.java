package modules.BMICaculator;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class BMIPage {

    WebDriver driver;
    By MetricTab    = By.id("menuon");
    By clearBtn     = By.className("clearbtn");
    By maleRab      = By.id("csex1");
    By femaleRab    = By.id("csex2");
    By ageTxt       = By.id("cage");
    By heightTxt    = By.id("cheightmeter");
    By weightTxt    = By.id("ckg");
    By caculatorBtn = By.xpath("//input[@value='Calculate']");
    By resultLbl    = By.className("bigtext");

    public BMIPage(WebDriver driver){
        this.driver = driver;
    }

    public String getResult() {
        String result = driver.findElement(resultLbl).getText();
        System.out.println(result);

        return driver.findElement(resultLbl).getText();
    }

    public void fillForm(String age, String gender, String height, String weight) {

        driver.findElement(clearBtn).click();

        driver.findElement(ageTxt).sendKeys(age);
        if(gender.equalsIgnoreCase("male"))
            driver.findElement(maleRab).click();
        else
            driver.findElement(femaleRab).click();

        driver.findElement(heightTxt).sendKeys(height);

        driver.findElement(weightTxt).sendKeys(weight);

        System.out.println(driver.findElement(caculatorBtn).getAttribute("value"));
        driver.findElement(caculatorBtn).click();
    }

    public void openMetricTab() {
        driver.findElement(MetricTab).click();
    }

    public void open(){
        driver.get("https://www.calculator.net/bmi-calculator.html");
    }
}
