package org.example.backend;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(features = "classpath:features/",
        glue = "org.example.backend.steps",
        plugin = {"pretty", "html:target/cucumber-reports.html"}
)
public class CucumberTest {
}
