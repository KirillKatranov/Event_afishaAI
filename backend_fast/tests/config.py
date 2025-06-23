from pydantic_settings import BaseSettings, SettingsConfigDict


class TestSettings(BaseSettings): 
    TEST_MODE: bool
    
    model_config = SettingsConfigDict() 
test_settings = TestSettings()