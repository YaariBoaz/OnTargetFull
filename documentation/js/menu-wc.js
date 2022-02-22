'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">onTarget documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ActivityHistoryModule.html" data-type="entity-link" >ActivityHistoryModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' : 'data-target="#xs-components-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' :
                                            'id="xs-components-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' }>
                                            <li class="link">
                                                <a href="components/ActivityLogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActivityLogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' : 'data-target="#xs-injectables-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' :
                                        'id="xs-injectables-links-module-AppModule-6b0426e28fd8129077a713fa49054aa7fb0537238d132bbbc9a3c3bd4692e1da4e37c537a628504e3613ab8580bedc2c565fe2c35eb69013ba5d98e799854354"' }>
                                        <li class="link">
                                            <a href="injectables/BleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GatewayService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GatewayService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/InitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InitService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/Tab1Service.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab1Service</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRouting.html" data-type="entity-link" >AuthRouting</a>
                            </li>
                            <li class="link">
                                <a href="modules/DrillModule.html" data-type="entity-link" >DrillModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' : 'data-target="#xs-components-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' :
                                            'id="xs-components-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' }>
                                            <li class="link">
                                                <a href="components/DrillComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DrillComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' : 'data-target="#xs-pipes-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' :
                                            'id="xs-pipes-links-module-DrillModule-8b0a0ce4ce9a83b58b8e8e4722cba6caf4fe5fbd347ac55690fda5531565f756962d0c077509a8a3cb49236f79acc012c1896f6aa9addd331a8716cf892b2a7f"' }>
                                            <li class="link">
                                                <a href="pipes/ReversePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReversePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link" >HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomePageModule-85e15be5e6ee5210733badfdbcb3bb8e6fd9e48fd58c9d6c76ad98c3d4bfc4cd229ba7627fa87ddca4f83b92c57a16fc1d31936073efc7ba1436411ad187e8b4"' : 'data-target="#xs-components-links-module-HomePageModule-85e15be5e6ee5210733badfdbcb3bb8e6fd9e48fd58c9d6c76ad98c3d4bfc4cd229ba7627fa87ddca4f83b92c57a16fc1d31936073efc7ba1436411ad187e8b4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-85e15be5e6ee5210733badfdbcb3bb8e6fd9e48fd58c9d6c76ad98c3d4bfc4cd229ba7627fa87ddca4f83b92c57a16fc1d31936073efc7ba1436411ad187e8b4"' :
                                            'id="xs-components-links-module-HomePageModule-85e15be5e6ee5210733badfdbcb3bb8e6fd9e48fd58c9d6c76ad98c3d4bfc4cd229ba7627fa87ddca4f83b92c57a16fc1d31936073efc7ba1436411ad187e8b4"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' : 'data-target="#xs-components-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' :
                                            'id="xs-components-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' }>
                                            <li class="link">
                                                <a href="components/AccessModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChallengeListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GunlistComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GunlistComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewTargetDesignComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NewTargetDesignComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NoConnetionErroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NoConnetionErroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectTargetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelectTargetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectTargetModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelectTargetModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShareDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShareDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SightlistComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SightlistComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Tab3Page.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab3Page</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsAndConditionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermsAndConditionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' : 'data-target="#xs-injectables-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' :
                                        'id="xs-injectables-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' }>
                                        <li class="link">
                                            <a href="injectables/ApiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HitNohitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HitNohitService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' : 'data-target="#xs-pipes-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' :
                                            'id="xs-pipes-links-module-SharedModule-a134e2a2686e7f5a7bebe2b27f881fec5c52bb2a4f6cde42e708c737ed6e31c2a7ae4589f81de85cf9770ed5781614680b5311905cf5d0ca296b1c134eaae9c4"' }>
                                            <li class="link">
                                                <a href="pipes/MakeItNormalTextPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MakeItNormalTextPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SigninModule.html" data-type="entity-link" >SigninModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SigninModule-33dca0e09ed521233ed6eb3d2d1210ee2b24cde8f591a3afb628f11b692f7d0fcad6f080a3804352575049c5918804439f23e95a0759118cae1049f4317f7e5e"' : 'data-target="#xs-components-links-module-SigninModule-33dca0e09ed521233ed6eb3d2d1210ee2b24cde8f591a3afb628f11b692f7d0fcad6f080a3804352575049c5918804439f23e95a0759118cae1049f4317f7e5e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SigninModule-33dca0e09ed521233ed6eb3d2d1210ee2b24cde8f591a3afb628f11b692f7d0fcad6f080a3804352575049c5918804439f23e95a0759118cae1049f4317f7e5e"' :
                                            'id="xs-components-links-module-SigninModule-33dca0e09ed521233ed6eb3d2d1210ee2b24cde8f591a3afb628f11b692f7d0fcad6f080a3804352575049c5918804439f23e95a0759118cae1049f4317f7e5e"' }>
                                            <li class="link">
                                                <a href="components/ErrorModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SigninComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SigninComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SigninModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SigninModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SignupModule.html" data-type="entity-link" >SignupModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/Tab1PageModule.html" data-type="entity-link" >Tab1PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' : 'data-target="#xs-components-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' :
                                            'id="xs-components-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' }>
                                            <li class="link">
                                                <a href="components/ActivityHistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActivityHistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Tab1Page.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab1Page</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' : 'data-target="#xs-injectables-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' :
                                        'id="xs-injectables-links-module-Tab1PageModule-85bcbfe9f942efd55fba8251d706b4eb99a78b94ad33572abe9c407af0b20d28dd9e1811835c57ef9518a4f6b01ceda5194cca92bf420c1f15c8cd07b538cb3f"' }>
                                        <li class="link">
                                            <a href="injectables/Tab3Service.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab3Service</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab2PageModule.html" data-type="entity-link" >Tab2PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab2PageModule-15dd08284a5bd7119ac21fcdfe7891acd382ad45592f5c164cbd3af8171d0b51786668382db33906e40214cdb38682a0af3c9123dc770558e99e8d2cc42a85ae"' : 'data-target="#xs-components-links-module-Tab2PageModule-15dd08284a5bd7119ac21fcdfe7891acd382ad45592f5c164cbd3af8171d0b51786668382db33906e40214cdb38682a0af3c9123dc770558e99e8d2cc42a85ae"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab2PageModule-15dd08284a5bd7119ac21fcdfe7891acd382ad45592f5c164cbd3af8171d0b51786668382db33906e40214cdb38682a0af3c9123dc770558e99e8d2cc42a85ae"' :
                                            'id="xs-components-links-module-Tab2PageModule-15dd08284a5bd7119ac21fcdfe7891acd382ad45592f5c164cbd3af8171d0b51786668382db33906e40214cdb38682a0af3c9123dc770558e99e8d2cc42a85ae"' }>
                                            <li class="link">
                                                <a href="components/BalisticCalculatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BalisticCalculatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChooseDrillComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChooseDrillComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Tab2Page.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab2Page</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab3PageModule.html" data-type="entity-link" >Tab3PageModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' : 'data-target="#xs-injectables-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' :
                                        'id="xs-injectables-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' }>
                                        <li class="link">
                                            <a href="injectables/StorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StorageService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' : 'data-target="#xs-pipes-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' :
                                            'id="xs-pipes-links-module-Tab3PageModule-fd4843c0fa883222eb23ff6bf5bf25a83580e9bbb92597f4e56926a98a08c1af7cd9437f58b65f15f14c318c04b433c42ec899a6dbcc2069e938a1c27a58b822"' }>
                                            <li class="link">
                                                <a href="pipes/CDVPhotoLibraryPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CDVPhotoLibraryPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageModule.html" data-type="entity-link" >TabsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' : 'data-target="#xs-components-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' :
                                            'id="xs-components-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' }>
                                            <li class="link">
                                                <a href="components/TabsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' : 'data-target="#xs-injectables-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' :
                                        'id="xs-injectables-links-module-TabsPageModule-4c0e2b7ce4d9cb6529dbc2297ccbc38e3299d4bca6b0628c455ffb221dd71615c6a21da71679783e82e96a0a00f727d1e329589cfb93ae624fdec47096f9b89b"' }>
                                        <li class="link">
                                            <a href="injectables/TabsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageRoutingModule.html" data-type="entity-link" >TabsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WizardModule.html" data-type="entity-link" >WizardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WizardModule-cafa5a7b84977f2965993fcad60e37b86afeeae6432cd89d113a9daadee39d5c4d748cdd54820d5da13c79899cb8e66d7078573e9c5188fad209d1238773570d"' : 'data-target="#xs-components-links-module-WizardModule-cafa5a7b84977f2965993fcad60e37b86afeeae6432cd89d113a9daadee39d5c4d748cdd54820d5da13c79899cb8e66d7078573e9c5188fad209d1238773570d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WizardModule-cafa5a7b84977f2965993fcad60e37b86afeeae6432cd89d113a9daadee39d5c4d748cdd54820d5da13c79899cb8e66d7078573e9c5188fad209d1238773570d"' :
                                            'id="xs-components-links-module-WizardModule-cafa5a7b84977f2965993fcad60e37b86afeeae6432cd89d113a9daadee39d5c4d748cdd54820d5da13c79899cb8e66d7078573e9c5188fad209d1238773570d"' }>
                                            <li class="link">
                                                <a href="components/SignupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupWizardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupWizardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WizardSummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WizardSummaryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BaseChart.html" data-type="entity-link" >BaseChart</a>
                            </li>
                            <li class="link">
                                <a href="classes/BestScores.html" data-type="entity-link" >BestScores</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstantData.html" data-type="entity-link" >ConstantData</a>
                            </li>
                            <li class="link">
                                <a href="classes/DashboardModel.html" data-type="entity-link" >DashboardModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FakeData.html" data-type="entity-link" >FakeData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Hit.html" data-type="entity-link" >Hit</a>
                            </li>
                            <li class="link">
                                <a href="classes/HitRatioChart.html" data-type="entity-link" >HitRatioChart</a>
                            </li>
                            <li class="link">
                                <a href="classes/HitrationDataModel.html" data-type="entity-link" >HitrationDataModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/HomeModel.html" data-type="entity-link" >HomeModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyHammerConfig.html" data-type="entity-link" >MyHammerConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Point.html" data-type="entity-link" >Point</a>
                            </li>
                            <li class="link">
                                <a href="classes/Point-1.html" data-type="entity-link" >Point</a>
                            </li>
                            <li class="link">
                                <a href="classes/RateOfFireChart.html" data-type="entity-link" >RateOfFireChart</a>
                            </li>
                            <li class="link">
                                <a href="classes/Recomondation.html" data-type="entity-link" >Recomondation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Square.html" data-type="entity-link" >Square</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeSpan.html" data-type="entity-link" >TimeSpan</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrainingHistory.html" data-type="entity-link" >TrainingHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/ZeroHitData.html" data-type="entity-link" >ZeroHitData</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BalisticCalculatorService.html" data-type="entity-link" >BalisticCalculatorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BleNewService.html" data-type="entity-link" >BleNewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BleService.html" data-type="entity-link" >BleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChallengesService.html" data-type="entity-link" >ChallengesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GatewayService.html" data-type="entity-link" >GatewayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HitNohitService.html" data-type="entity-link" >HitNohitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InitService.html" data-type="entity-link" >InitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NetworkService.html" data-type="entity-link" >NetworkService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PopupsService.html" data-type="entity-link" >PopupsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileImageService.html" data-type="entity-link" >ProfileImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShootingService.html" data-type="entity-link" >ShootingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Tab1Service.html" data-type="entity-link" >Tab1Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Tab3Service.html" data-type="entity-link" >Tab3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TabsService.html" data-type="entity-link" >TabsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WizardService.html" data-type="entity-link" >WizardService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/HttpErrorInterceptor.html" data-type="entity-link" >HttpErrorInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuardService.html" data-type="entity-link" >AuthGuardService</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuardService-1.html" data-type="entity-link" >AuthGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DoghnuChartMetaData.html" data-type="entity-link" >DoghnuChartMetaData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrillInfo.html" data-type="entity-link" >DrillInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrillModel.html" data-type="entity-link" >DrillModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrillModelHitNoHit.html" data-type="entity-link" >DrillModelHitNoHit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrillObject.html" data-type="entity-link" >DrillObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrillResultModel.html" data-type="entity-link" >DrillResultModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Entry.html" data-type="entity-link" >Entry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryModel.html" data-type="entity-link" >HistoryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryValueItemModel.html" data-type="entity-link" >HistoryValueItemModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryValueItemReccomendationModel.html" data-type="entity-link" >HistoryValueItemReccomendationModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryValueItemShotModel.html" data-type="entity-link" >HistoryValueItemShotModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryValueItemStatsItemodel.html" data-type="entity-link" >HistoryValueItemStatsItemodel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryValueItemStatsodel.html" data-type="entity-link" >HistoryValueItemStatsodel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoryValueModel.html" data-type="entity-link" >HistoryValueModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HitJson.html" data-type="entity-link" >HitJson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Hits.html" data-type="entity-link" >Hits</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImodalType.html" data-type="entity-link" >ImodalType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImodalType-1.html" data-type="entity-link" >ImodalType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImodalType-2.html" data-type="entity-link" >ImodalType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InventoryModel.html" data-type="entity-link" >InventoryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Itypes.html" data-type="entity-link" >Itypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Itypes-1.html" data-type="entity-link" >Itypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Itypes-2.html" data-type="entity-link" >Itypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LineChartMetaData.html" data-type="entity-link" >LineChartMetaData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ShotItem.html" data-type="entity-link" >ShotItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ShotItem-1.html" data-type="entity-link" >ShotItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SplitAndTotalTime.html" data-type="entity-link" >SplitAndTotalTime</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainingHistory.html" data-type="entity-link" >TrainingHistory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ZeroTableGetObject.html" data-type="entity-link" >ZeroTableGetObject</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/ReversePipe-1.html" data-type="entity-link" >ReversePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});