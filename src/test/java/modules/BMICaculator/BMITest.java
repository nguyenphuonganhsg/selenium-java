package modules.BMICaculator;

import modules.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class BMITest extends BaseTest {
    @Test
    static void calculator(){
        BMIPage bmiPage = new BMIPage(driver);
        bmiPage.open();
        bmiPage.openMetricTab();
        bmiPage.fillForm("34","Female", "147", "50");
        Assert.assertEquals( bmiPage.getResult(),  "BMI = 23.1 kg/m2   (Normal)");
    }

}
