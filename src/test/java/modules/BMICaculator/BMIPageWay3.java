package modules.BMICaculator;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class BMIPageWay3 {

    @FindBy(id="menuon")
    WebElement MetricTab;

    @FindBy(className="clearbtn")
    WebElement clearBtn;

    @FindBy(id="csex1")
    WebElement maleRab;

    @FindBy(id="csex2")
    WebElement femaleRab;

    @FindBy(id="cage")
    WebElement ageTxt;

    @FindBy(id="cheightmeter")
    WebElement heightTxt;

    @FindBy(id="ckg")
    WebElement weightTxt;

    @FindBy(className="bigtext")
    WebElement resultLbl;

    @FindBy(xpath="//input[@value='Calculate']")
    WebElement caculatorBtn;

    public BMIPageWay3(WebDriver driver){
        PageFactory.initElements(driver, this);
    }

    public String getResult() {
        return resultLbl.getText();
    }

    public void fillForm(String age, String gender, String height, String weight) {

        clearBtn.click();

        ageTxt.sendKeys(age);
        if(gender.equalsIgnoreCase("male"))
            maleRab.click();
        else
            femaleRab.click();

        heightTxt.sendKeys(height);

        weightTxt.sendKeys(weight);

        System.out.println(caculatorBtn.getAttribute("value"));
        caculatorBtn.click();
    }

    public void openMetricTab() {
        MetricTab.click();
    }
}
