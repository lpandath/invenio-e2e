import { expect, Page } from '@playwright/test';
import { Locators } from '../locators';
import { HomePage } from './homePage';

/**
 * Class representing a base page with common functionality for all pages.
 */
export class BasePage<T extends Locators = Locators> {
    protected page: Page;
    protected locators: T;
    protected availablePages: { [key: string]: object };

    /**
     * Creates a new instance of the abstract base page.
     * 
     * @param page  Playwright Page object representing the current page.
     * @param locators  An object containing locators for elements on the page.
     * @param availablePages  An object containing available pages for navigation.
     */
    constructor({ page, locators, availablePages }: {
        page: Page,
        locators: T,
        availablePages: { [key: string]: object }
    }) {
        this.page = page;
        this.locators = locators;
        this.availablePages = availablePages;
    }

    // VALIDATION
    /**
     * Validates that the loaded page has a logo link in the header.
     */
    async validatePageLoaded(): Promise<void> {
        await this.page.waitForSelector(this.locators.header.logoLink);
    }

    /**
     * Validates that the logo is visible on the page.
     */
    async expectLogoVisible(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        const logo = this.page.locator(this.locators.header.logoLink);
        await expect(logo).toBeVisible();
    }

    // NAVIGATION
    /**
     * Navigates to the home page as we should always have a home page link in the header.
     * 
     * @returns the home page
     */
    async navigateToHomePage(): Promise<HomePage> {
        const logoLink = await this.page.locator(this.locators.header.logoLink);
        await logoLink.click();
        const homePage: HomePage = this.availablePages['homePage'] as HomePage;
        await homePage.validatePageLoaded();
        return homePage;
    }
}